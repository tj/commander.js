import * as childProcess from 'child_process';
import * as commander from '../index.js';
import * as path from 'path';
import * as util from 'util';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

const execFileAsync = util.promisify(childProcess.execFile);

describe('default executable command', () => {
  // Calling node explicitly so pm works without file suffix cross-platform.
  const pm = path.join(import.meta.dirname, './fixtures/pm');

  test('when default subcommand and no command then call default', async () => {
    const { stdout } = await execFileAsync('node', [pm]);
    assert.equal(stdout, 'default\n');
  });

  test('when default subcommand and unrecognised argument then call default with argument', async () => {
    const { stdout } = await execFileAsync('node', [pm, 'an-argument']);
    assert.equal(stdout, 'default\n["an-argument"]\n');
  });

  test('when default subcommand and unrecognised option then call default with option', async () => {
    const { stdout } = await execFileAsync('node', [pm, '--an-option']);
    assert.equal(stdout, 'default\n["--an-option"]\n');
  });
});

describe('default action command', () => {
  function makeProgram(t) {
    const program = new commander.Command();
    const actionMock = t.mock.fn();
    program.command('other');
    program
      .command('default', { isDefault: true })
      .allowUnknownOption()
      .allowExcessArguments()
      .action(actionMock);
    return { program, actionMock };
  }

  test('when default subcommand and no command then call default', (t) => {
    const { program, actionMock } = makeProgram(t);
    program.parse('node test.js'.split(' '));
    assert.equal(actionMock.mock.callCount(), 1);
  });

  test('when default subcommand and unrecognised argument then call default', (t) => {
    const { program, actionMock } = makeProgram(t);
    program.parse('node test.js an-argument'.split(' '));
    assert.equal(actionMock.mock.callCount(), 1);
  });

  test('when default subcommand and unrecognised option then call default', (t) => {
    const { program, actionMock } = makeProgram(t);
    program.parse('node test.js --an-option'.split(' '));
    assert.equal(actionMock.mock.callCount(), 1);
  });
});

describe('default added command', () => {
  function makeProgram(t) {
    const actionMock = t.mock.fn();
    const defaultCmd = new commander.Command('default')
      .allowUnknownOption()
      .allowExcessArguments()
      .action(actionMock);

    const program = new commander.Command();
    program.command('other');
    program.addCommand(defaultCmd, { isDefault: true });
    return { program, actionMock };
  }

  test('when default subcommand and no command then call default', (t) => {
    const { program, actionMock } = makeProgram(t);
    program.parse('node test.js'.split(' '));
    assert.equal(actionMock.mock.callCount(), 1);
  });

  test('when default subcommand and unrecognised argument then call default', (t) => {
    const { program, actionMock } = makeProgram(t);
    program.parse('node test.js an-argument'.split(' '));
    assert.equal(actionMock.mock.callCount(), 1);
  });

  test('when default subcommand and unrecognised option then call default', (t) => {
    const { program, actionMock } = makeProgram(t);
    program.parse('node test.js --an-option'.split(' '));
    assert.equal(actionMock.mock.callCount(), 1);
  });
});
