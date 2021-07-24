const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const commander = require('../');

// This file does in-process mocking.
// See also command.executableSubcommand.lookup.test.js

const gLocalDirectory = path.resolve(__dirname, 'fixtures'); // Real directory, although not actually searching for files in it.

function extractMockSpawnArgs(mock) {
  expect(mock).toHaveBeenCalled();
  // non-Win, launchWithNode: childProcess.spawn(process.argv[0], args, { stdio: 'inherit' });
  // Win always: childProcess.spawn(process.execPath, args, { stdio: 'inherit' });
  return mock.mock.calls[0][1];
}

function extractMockSpawnCommand(mock) {
  expect(mock).toHaveBeenCalled();
  // child_process.spawn(command[, args][, options])
  return mock.mock.calls[0][0];
}

const describeOrSkipOnWindows = (process.platform === 'win32') ? describe.skip : describe;

describe('search for subcommand', () => {
  let spawnSpy;
  let existsSpy;

  beforeAll(() => {
    spawnSpy = jest.spyOn(childProcess, 'spawn').mockImplementation(() => {
      return {
        on: () => {}
      };
    });
  });

  beforeEach(() => {
    existsSpy = jest.spyOn(fs, 'existsSync');
  });

  afterEach(() => {
    spawnSpy.mockClear();
    existsSpy.mockRestore();
  });

  afterAll(() => {
    spawnSpy.mockRestore();
  });

  describe('whether perform search for local files', () => {
    beforeEach(() => {
      existsSpy.mockImplementation(() => false);
    });

    test('when no script arg or executableDir then no search for local file', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['sub'], { from: 'user' });

      expect(existsSpy).not.toHaveBeenCalled();
    });

    test('when script arg then search for local files', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['node', 'script-name', 'sub']);

      expect(existsSpy).toHaveBeenCalled();
    });

    test('when executableDir then search for local files)', () => {
      const program = new commander.Command();
      program.name('pm');
      program.executableDir(__dirname);
      program.command('sub', 'executable description');
      program.parse(['sub'], { from: 'user' });

      expect(existsSpy).toHaveBeenCalled();
    });
  });

  // We always use node on Windows, and don't spawn executable as the command (which may be a feature or a shortcoming!?).
  describeOrSkipOnWindows('subcommand command name with no matching local file', () => {
    beforeEach(() => {
      existsSpy.mockImplementation(() => false);
    });

    test('when named pm and no script arg or executableDir then spawn pm-sub as command', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['sub'], { from: 'user' });

      expect(extractMockSpawnCommand(spawnSpy)).toEqual('pm-sub');
    });

    test('when named pm and script arg then still spawn pm-sub as command', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['node', 'script-name', 'sub']);

      expect(extractMockSpawnCommand(spawnSpy)).toEqual('pm-sub');
    });

    test('when no name and script arg then spawn script-sub as command', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');
      program.parse(['node', 'script.js', 'sub']);

      expect(extractMockSpawnCommand(spawnSpy)).toEqual('script-sub');
    });

    test('when named pm and script arg and executableFile then spawn executableFile as command', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description', { executableFile: 'myExecutable' });
      program.parse(['node', 'script.js', 'sub']);

      expect(extractMockSpawnCommand(spawnSpy)).toEqual('myExecutable');
    });
  });

  describe('subcommand command name with matching local file', () => {
    test('when construct with name pm and script arg then spawn local pm-sub.js as command', () => {
      const program = new commander.Command('pm');
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'pm-sub.js');
      existsSpy.mockImplementation((path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script.js'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    test('when name pm and script arg then spawn local pm-sub.js as command', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'pm-sub.js');
      existsSpy.mockImplementation((path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script.js'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    test('when script arg then spawn local script-sub.js as command', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'script-sub.js');
      existsSpy.mockImplementation((path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script.js'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    test('when name pm and executableDir then spawn local pm-sub.js as command', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');

      const execDir = path.resolve(gLocalDirectory, 'exec-dir');
      program.executableDir(execDir);
      const localPath = path.resolve(execDir, 'pm-sub.js');
      existsSpy.mockImplementation((path) => path === localPath);
      program.parse(['sub'], { from: 'user' });

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });
  });

  describe('search for local file', () => {
    test('when script arg then search for local script-sub.js, .ts, .tsx, .mpjs, .cjs', () => {
      existsSpy.mockImplementation((path) => false);
      const program = new commander.Command();
      program.command('sub', 'executable description');
      const scriptPath = path.resolve(gLocalDirectory, 'script');
      program.parse(['node', scriptPath, 'sub']);
      const sourceExt = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];
      sourceExt.forEach((ext) => {
        expect(existsSpy).toHaveBeenCalledWith(path.resolve(gLocalDirectory, `script-sub${ext}`));
      });
    });

    test('when script.js arg and local script-sub.js then spawns local script-sub.js', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');
      const scriptPath = path.resolve(gLocalDirectory, 'script.js');
      const subPath = path.resolve(gLocalDirectory, 'script-sub.js');
      existsSpy.mockImplementation((path) => path === subPath);
      program.parse(['node', scriptPath, 'sub']);
      expect(existsSpy).toHaveBeenCalledWith(subPath);
      expect(extractMockSpawnArgs(spawnSpy)).toEqual([subPath]);
    });

    test('when script.js arg and local script-sub.js then spawns local script-sub', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');
      const scriptPath = path.resolve(gLocalDirectory, 'script.js');
      const subPath = path.resolve(gLocalDirectory, 'script-sub.js');
      existsSpy.mockImplementation((path) => path === subPath);
      program.parse(['node', scriptPath, 'sub']);
      expect(existsSpy).toHaveBeenCalledWith(subPath);
      expect(extractMockSpawnArgs(spawnSpy)).toEqual([subPath]);
    });
  });

  // search (which needs a directory)
  // - executableDir searches in executableDir
  // - named pm, dir, local pm-sub (Mac/Win difference in whether uses node)
  // - named pm, dir, local pm-sub.js
  // - arg pwd/script, local script-sub.js
  // - arg pwd/script.js, local script-sub.js
  // - arg symlink to pwd/script.js, local symlink-sub.js [LEGACY]
  // - relative executableDir + scriptDir
  // - relative scriptDir alone (no)
  // - relative executableDir (no)
  // relative executableFile (relative to search dir)
  // absolute executableFile  (overrides search dir)

  // local over global? Known global? non-Windows only? Perhaps not bother, out of scope.
  // test for "node" being used to run script? i.e. process.execArg or process.argv[0]. Tricky and legacy, out-of-scope for current work.
});
