import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as commander from '../index.js';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

describe('Command.usePackageJson()', () => {
  let testDir;

  test.before(async () => {
    testDir = resolve(tmpdir(), `commander-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  test.after(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  test('when using default options then sets name, version, and description from package.json', async () => {
    const projectDir = join(testDir, 'default-test');
    const srcDir = join(projectDir, 'src');
    await mkdir(srcDir, { recursive: true });

    const packageJson = {
      name: 'my-cli',
      version: '1.2.3',
      description: 'A powerful CLI tool',
    };
    await writeFile(join(projectDir, 'package.json'), JSON.stringify(packageJson));

    // Simulate calling from src directory
    const program = new commander.Command();
    await program.usePackageJson(srcDir);

    assert.equal(program.name(), 'my-cli');
    assert.equal(program.version(), '1.2.3');
    assert.equal(program.description(), 'A powerful CLI tool');
  });

  test('when using selective options then only sets specified fields', async () => {
    const projectDir = join(testDir, 'selective-test');
    const srcDir = join(projectDir, 'src');
    await mkdir(srcDir, { recursive: true });

    const packageJson = {
      name: 'my-cli',
      version: '1.2.3',
      description: 'A powerful CLI tool',
    };
    await writeFile(join(projectDir, 'package.json'), JSON.stringify(packageJson));

    const program = new commander.Command();
    await program.usePackageJson(srcDir, {
      name: true,
      version: true,
      description: false,
    });

    assert.equal(program.name(), 'my-cli');
    assert.equal(program.version(), '1.2.3');
    assert.equal(program.description(), ''); // unchanged
  });

  test('when package.json missing name field then version and description are still set', async () => {
    const projectDir = join(testDir, 'missing-name-test');
    const srcDir = join(projectDir, 'src');
    await mkdir(srcDir, { recursive: true });

    const packageJson = {
      version: '2.0.0',
      description: 'CLI without explicit name',
    };
    await writeFile(join(projectDir, 'package.json'), JSON.stringify(packageJson));

    const program = new commander.Command();
    await program.usePackageJson(srcDir);

    assert.equal(program.name(), ''); // unchanged
    assert.equal(program.version(), '2.0.0');
    assert.equal(program.description(), 'CLI without explicit name');
  });

  test('when no package.json found then throws error', async () => {
    const dirWithoutPackageJson = join(testDir, 'no-package-test');
    await mkdir(dirWithoutPackageJson, { recursive: true });

    const program = new commander.Command();

    await assert.rejects(
      async () => await program.usePackageJson(dirWithoutPackageJson),
      /Could not find package.json/,
    );
  });

  test('when nested directory then finds package.json in parent', async () => {
    const projectDir = join(testDir, 'nested-test');
    const nestedDir = join(projectDir, 'src', 'commands', 'utils');
    await mkdir(nestedDir, { recursive: true });

    const packageJson = {
      name: 'nested-cli',
      version: '3.4.5',
      description: 'CLI with nested structure',
    };
    await writeFile(join(projectDir, 'package.json'), JSON.stringify(packageJson));

    const program = new commander.Command();
    await program.usePackageJson(nestedDir);

    assert.equal(program.name(), 'nested-cli');
    assert.equal(program.version(), '3.4.5');
    assert.equal(program.description(), 'CLI with nested structure');
  });

  test('when using import.meta.url with ESM then works correctly', async () => {
    const projectDir = join(testDir, 'esm-test');
    const srcDir = join(projectDir, 'src');
    await mkdir(srcDir, { recursive: true });

    const packageJson = {
      name: 'esm-cli',
      version: '4.5.6',
      description: 'ESM-based CLI',
    };
    await writeFile(join(projectDir, 'package.json'), JSON.stringify(packageJson));

    // Create a mock file URL
    const mockFileUrl = new URL('file://' + join(srcDir, 'cli.js'));

    const program = new commander.Command();
    await program.usePackageJson(mockFileUrl);

    assert.equal(program.name(), 'esm-cli');
    assert.equal(program.version(), '4.5.6');
    assert.equal(program.description(), 'ESM-based CLI');
  });

  test('when all options false then nothing is set', async () => {
    const projectDir = join(testDir, 'all-false-test');
    const srcDir = join(projectDir, 'src');
    await mkdir(srcDir, { recursive: true });

    const packageJson = {
      name: 'all-false-cli',
      version: '5.6.7',
      description: 'All options disabled',
    };
    await writeFile(join(projectDir, 'package.json'), JSON.stringify(packageJson));

    const program = new commander.Command();
    await program.usePackageJson(srcDir, {
      name: false,
      version: false,
      description: false,
    });

    assert.equal(program.name(), ''); // unchanged
    assert.equal(program.version(), undefined); // unchanged
    assert.equal(program.description(), ''); // unchanged
  });

  test('when fields are not strings then they are ignored', async () => {
    const projectDir = join(testDir, 'non-string-test');
    const srcDir = join(projectDir, 'src');
    await mkdir(srcDir, { recursive: true });

    const packageJson = {
      name: 123, // not a string
      version: null, // not a string
      description: 'valid description',
    };
    await writeFile(join(projectDir, 'package.json'), JSON.stringify(packageJson));

    const program = new commander.Command();
    await program.usePackageJson(srcDir);

    assert.equal(program.name(), ''); // unchanged
    assert.equal(program.version(), undefined); // unchanged
    assert.equal(program.description(), 'valid description');
  });

  test('when chained with other methods then maintains chainability', async () => {
    const projectDir = join(testDir, 'chain-test');
    const srcDir = join(projectDir, 'src');
    await mkdir(srcDir, { recursive: true });

    const packageJson = {
      name: 'chain-cli',
      version: '6.7.8',
      description: 'Chainable CLI',
    };
    await writeFile(join(projectDir, 'package.json'), JSON.stringify(packageJson));

    const program = new commander.Command();

    // Should be chainable
    const result = await program.usePackageJson(srcDir).option('-d, --debug', 'debug mode');

    assert.ok(result === program);
    assert.equal(program.name(), 'chain-cli');
    assert.equal(program.version(), '6.7.8');
    assert.equal(program.description(), 'Chainable CLI');
  });
});