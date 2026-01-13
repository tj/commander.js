const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// This file does in-process mocking. Bit clumsy but faster and less external clutter than using fixtures.
// See also command.executableSubcommand.lookup.test.js for tests using fixtures.

const gLocalDirectory = path.resolve(__dirname, 'fixtures'); // Real directory, although not actually searching for files in it.

function extractMockSpawnArgs(spawnSpy) {
  assert.equal(spawnSpy.mock.callCount() > 0, true);
  // This is very fragile on implementation details of how subcommand spawned.
  // non-Win Jest, launchWithNode: childProcess.spawn(process.argv[0], args, { stdio: 'inherit' });
  // Win Jest always: childProcess.spawn(process.execPath, args, { stdio: 'inherit' });
  // node:test passes wild number of node args on front!

  const callArgs = spawnSpy.mock.calls[0].arguments;
  return callArgs[1].slice(-1); // fingers crossed last arg is filename!
}

function extractMockSpawnCommand(spawnSpy) {
  assert.equal(spawnSpy.mock.callCount() > 0, true);
  // child_process.spawn(command[, args][, options])
  const callArgs = spawnSpy.mock.calls[0].arguments;
  return callArgs[0];
}

const describeOrSkipOnWindows =
  process.platform === 'win32' ? describe.skip : describe;

describe('executable subcommand search behaviour', () => {
  function makeSpies(t, existsFn) {
    const spawnSpy = t.mock.method(childProcess, 'spawn', () => {
      return {
        on: () => {},
        killed: true,
      };
    });
    const existsSpy = t.mock.method(fs, 'existsSync', existsFn);
    return { spawnSpy, existsSpy };
  }

  // fs.existsSync gets called on Windows outside the search, so skip the tests (or come up with a different way of checking).
  describe('whether perform search for local files', () => {
    test('when no script arg or executableDir then no search for local file', (t) => {
      const { existsSpy } = makeSpies(t, () => false);
      const program = new commander.Command();
      program._checkForMissingExecutable = () => {}; // suppress error, call mocked spawn
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['sub'], { from: 'user' });

      assert.equal(existsSpy.mock.callCount(), 0);
    });

    test('when script arg then search for local files', (t) => {
      const { existsSpy } = makeSpies(t, () => false);
      const program = new commander.Command();
      program._checkForMissingExecutable = () => {}; // suppress error, call mocked spawn
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['node', 'script-name', 'sub']);

      assert.equal(existsSpy.mock.callCount() > 0, true);
    });

    test('when executableDir then search for local files)', (t) => {
      const { existsSpy } = makeSpies(t, () => false);
      const program = new commander.Command();
      program._checkForMissingExecutable = () => {}; // suppress error, call mocked spawn
      program.name('pm');
      program.executableDir(__dirname);
      program.command('sub', 'executable description');
      program.parse(['sub'], { from: 'user' });

      assert.equal(existsSpy.mock.callCount() > 0, true);
    });
  });

  // We always use node on Windows, and don't spawn executable as the command (which may be a feature or a shortcoming!?).
  describeOrSkipOnWindows(
    'subcommand command name with no matching local file (non-Windows)',
    () => {
      test('when named pm and no script arg or executableDir then spawn pm-sub as command', (t) => {
        const { spawnSpy } = makeSpies(t, () => false);
        const program = new commander.Command();
        program.name('pm');
        program.command('sub', 'executable description');
        program.parse(['sub'], { from: 'user' });

        assert.equal(extractMockSpawnCommand(spawnSpy), 'pm-sub');
      });

      test('when named pm and script arg then still spawn pm-sub as command', (t) => {
        const { spawnSpy } = makeSpies(t, () => false);
        const program = new commander.Command();
        program.name('pm');
        program.command('sub', 'executable description');
        program.parse(['node', 'script-name', 'sub']);

        assert.equal(extractMockSpawnCommand(spawnSpy), 'pm-sub');
      });

      test('when no name and script arg then spawn script-sub as command', (t) => {
        const { spawnSpy } = makeSpies(t, () => false);
        const program = new commander.Command();
        program.command('sub', 'executable description');
        program.parse(['node', 'script.js', 'sub']);

        assert.equal(extractMockSpawnCommand(spawnSpy), 'script-sub');
      });

      test('when named pm and script arg and executableFile then spawn executableFile as command', (t) => {
        const { spawnSpy } = makeSpies(t, () => false);
        const program = new commander.Command();
        program.command('sub', 'executable description', {
          executableFile: 'myExecutable',
        });
        program.parse(['node', 'script.js', 'sub']);

        assert.equal(extractMockSpawnCommand(spawnSpy), 'myExecutable');
      });
    },
  );

  describe('subcommand command name with matching local file', () => {
    test('when construct with name pm and script arg then spawn local pm-sub.js', (t) => {
      const program = new commander.Command('pm');
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'pm-sub.js');
      const { spawnSpy } = makeSpies(t, (path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      assert.deepEqual(extractMockSpawnArgs(spawnSpy), [localPath]);
    });

    test('when name pm and script arg then spawn local pm-sub.js', (t) => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'pm-sub.js');
      const { spawnSpy } = makeSpies(t, (path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      assert.deepEqual(extractMockSpawnArgs(spawnSpy), [localPath]);
    });

    test('when script arg then spawn local script-sub.js', (t) => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'script-sub.js');
      const { spawnSpy } = makeSpies(t, (path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      assert.deepEqual(extractMockSpawnArgs(spawnSpy), [localPath]);
    });

    test('when name pm and script arg and only script-sub.js then fallback to spawn local script-sub.js', (t) => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');

      // Fallback for compatibility with Commander <= v8
      const localPath = path.resolve(gLocalDirectory, 'script-sub.js');
      const { spawnSpy } = makeSpies(t, (path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      assert.deepEqual(extractMockSpawnArgs(spawnSpy), [localPath]);
    });

    test('when name pm and executableDir then spawn local pm-sub.js', (t) => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');

      const execDir = path.resolve(gLocalDirectory, 'exec-dir');
      program.executableDir(execDir);
      const localPath = path.resolve(execDir, 'pm-sub.js');
      const { spawnSpy } = makeSpies(t, (path) => path === localPath);
      program.parse(['sub'], { from: 'user' });

      assert.deepEqual(extractMockSpawnArgs(spawnSpy), [localPath]);
    });

    test('when script arg and relative executableDir then spawn relative script-sub.js', (t) => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const execDir = 'exec-dir';
      program.executableDir(execDir);
      const localPath = path.resolve(gLocalDirectory, execDir, 'script-sub.js');
      const { spawnSpy } = makeSpies(t, (path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script'), 'sub']);

      assert.deepEqual(extractMockSpawnArgs(spawnSpy), [localPath]);
    });

    test('when script arg and absolute executableDir then spawn absolute script-sub.js', (t) => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const execDir = path.resolve(gLocalDirectory, 'exec-dir');
      program.executableDir(execDir);
      const localPath = path.resolve(execDir, 'script-sub.js');
      const { spawnSpy } = makeSpies(t, (path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script-Dir', 'script'),
        'sub',
      ]);

      assert.deepEqual(extractMockSpawnArgs(spawnSpy), [localPath]);
    });

    test('when script arg is link and and link-sub relative to link target then spawn local link-sub', (t) => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const linkPath = path.resolve(gLocalDirectory, 'link', 'link');
      const scriptPath = path.resolve(gLocalDirectory, 'script', 'script.js');
      const scriptSubPath = path.resolve(
        gLocalDirectory,
        'script',
        'link-sub.js',
      );
      t.mock.method(fs, 'realpathSync', (path) => {
        return path === linkPath ? scriptPath : linkPath;
      });
      const { spawnSpy } = makeSpies(t, (path) => path === scriptSubPath);
      program.parse(['node', linkPath, 'sub']);

      assert.deepEqual(extractMockSpawnArgs(spawnSpy), [scriptSubPath]);
    });

    test('when name pm and script arg and relative executableFile then spawn local exec.js', (t) => {
      const program = new commander.Command('pm');
      const localPath = path.join('relative', 'exec.js');
      const absolutePath = path.resolve(gLocalDirectory, localPath);
      program.command('sub', 'executable description', {
        executableFile: localPath,
      });

      const { spawnSpy } = makeSpies(t, (path) => path === absolutePath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      assert.deepEqual(extractMockSpawnArgs(spawnSpy), [absolutePath]);
    });

    test('when name pm and script arg and absolute executableFile then spawn local exec.js', (t) => {
      const program = new commander.Command('pm');
      const localPath = path.resolve(gLocalDirectory, 'absolute', 'exec.js');
      program.command('sub', 'executable description', {
        executableFile: localPath,
      });

      const { spawnSpy } = makeSpies(t, (path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      assert.deepEqual(extractMockSpawnArgs(spawnSpy), [localPath]);
    });
  });

  describe('search for local file', () => {
    test('when script arg then search for local script-sub.js, .ts, .tsx, .mpjs, .cjs', (t) => {
      const { existsSpy } = makeSpies(t, () => false);
      const program = new commander.Command();
      program._checkForMissingExecutable = () => {}; // suppress error, call mocked spawn
      program.command('sub', 'executable description');
      const scriptPath = path.resolve(gLocalDirectory, 'script');
      program.parse(['node', scriptPath, 'sub']);
      const sourceExt = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];
      sourceExt.forEach((ext) => {
        const expectedPath = path.resolve(gLocalDirectory, `script-sub${ext}`);
        const wasCalled = existsSpy.mock.calls.some(
          (call) => call.arguments[0] === expectedPath,
        );
        assert.equal(
          wasCalled,
          true,
          `Expected existsSpy to be called with ${expectedPath}`,
        );
      });
    });
  });
});
