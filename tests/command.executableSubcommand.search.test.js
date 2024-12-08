const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const commander = require('../');

// This file does in-process mocking. Bit clumsy but faster and less external clutter than using fixtures.
// See also command.executableSubcommand.lookup.test.js for tests using fixtures.

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

const describeOrSkipOnWindows =
  process.platform === 'win32' ? describe.skip : describe;

describe('search for subcommand', () => {
  let spawnSpy;
  let existsSpy;

  beforeAll(() => {
    spawnSpy = jest.spyOn(childProcess, 'spawn').mockImplementation(() => {
      return {
        on: () => {},
        killed: true,
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

  // fs.existsSync gets called on Windows outside the search, so skip the tests (or come up with a different way of checking).
  describe('whether perform search for local files', () => {
    beforeEach(() => {
      existsSpy.mockImplementation(() => false);
    });

    test('when no script arg or executableDir then no search for local file', () => {
      const program = new commander.Command();
      program._checkForMissingExecutable = () => {}; // suppress error, call mocked spawn
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['sub'], { from: 'user' });

      expect(existsSpy).not.toHaveBeenCalled();
    });

    test('when script arg then search for local files', () => {
      const program = new commander.Command();
      program._checkForMissingExecutable = () => {}; // suppress error, call mocked spawn
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['node', 'script-name', 'sub']);

      expect(existsSpy).toHaveBeenCalled();
    });

    test('when executableDir then search for local files)', () => {
      const program = new commander.Command();
      program._checkForMissingExecutable = () => {}; // suppress error, call mocked spawn
      program.name('pm');
      program.executableDir(__dirname);
      program.command('sub', 'executable description');
      program.parse(['sub'], { from: 'user' });

      expect(existsSpy).toHaveBeenCalled();
    });
  });

  // We always use node on Windows, and don't spawn executable as the command (which may be a feature or a shortcoming!?).
  describeOrSkipOnWindows(
    'subcommand command name with no matching local file (non-Windows)',
    () => {
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
        program.command('sub', 'executable description', {
          executableFile: 'myExecutable',
        });
        program.parse(['node', 'script.js', 'sub']);

        expect(extractMockSpawnCommand(spawnSpy)).toEqual('myExecutable');
      });
    },
  );

  describe('subcommand command name with matching local file', () => {
    test('when construct with name pm and script arg then spawn local pm-sub.js', () => {
      const program = new commander.Command('pm');
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'pm-sub.js');
      existsSpy.mockImplementation((path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    test('when name pm and script arg then spawn local pm-sub.js', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'pm-sub.js');
      existsSpy.mockImplementation((path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    test('when script arg then spawn local script-sub.js', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'script-sub.js');
      existsSpy.mockImplementation((path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    test('when name pm and script arg and only script-sub.js then fallback to spawn local script-sub.js', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');

      // Fallback for compatibility with Commander <= v8
      const localPath = path.resolve(gLocalDirectory, 'script-sub.js');
      existsSpy.mockImplementation((path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    test('when name pm and executableDir then spawn local pm-sub.js', () => {
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

    test('when script arg and relative executableDir then spawn relative script-sub.js', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const execDir = 'exec-dir';
      program.executableDir(execDir);
      const localPath = path.resolve(gLocalDirectory, execDir, 'script-sub.js');
      existsSpy.mockImplementation((path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    test('when script arg and absolute executableDir then spawn absolute script-sub.js', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const execDir = path.resolve(gLocalDirectory, 'exec-dir');
      program.executableDir(execDir);
      const localPath = path.resolve(execDir, 'script-sub.js');
      existsSpy.mockImplementation((path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script-Dir', 'script'),
        'sub',
      ]);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    test('when script arg is link and and link-sub relative to link target then spawn local link-sub', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const linkPath = path.resolve(gLocalDirectory, 'link', 'link');
      const scriptPath = path.resolve(gLocalDirectory, 'script', 'script.js');
      const scriptSubPath = path.resolve(
        gLocalDirectory,
        'script',
        'link-sub.js',
      );
      const realPathSyncSpy = jest
        .spyOn(fs, 'realpathSync')
        .mockImplementation((path) => {
          return path === linkPath ? scriptPath : linkPath;
        });
      existsSpy.mockImplementation((path) => path === scriptSubPath);
      program.parse(['node', linkPath, 'sub']);
      realPathSyncSpy.mockRestore();

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([scriptSubPath]);
    });

    test('when name pm and script arg and relative executableFile then spawn local exec.js', () => {
      const program = new commander.Command('pm');
      const localPath = path.join('relative', 'exec.js');
      const absolutePath = path.resolve(gLocalDirectory, localPath);
      program.command('sub', 'executable description', {
        executableFile: localPath,
      });

      existsSpy.mockImplementation((path) => path === absolutePath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([absolutePath]);
    });

    test('when name pm and script arg and absolute executableFile then spawn local exec.js', () => {
      const program = new commander.Command('pm');
      const localPath = path.resolve(gLocalDirectory, 'absolute', 'exec.js');
      program.command('sub', 'executable description', {
        executableFile: localPath,
      });

      existsSpy.mockImplementation((path) => path === localPath);
      program.parse([
        'node',
        path.resolve(gLocalDirectory, 'script.js'),
        'sub',
      ]);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });
  });

  describe('search for local file', () => {
    test('when script arg then search for local script-sub.js, .ts, .tsx, .mpjs, .cjs', () => {
      existsSpy.mockImplementation((path) => false);
      const program = new commander.Command();
      program._checkForMissingExecutable = () => {}; // suppress error, call mocked spawn
      program.command('sub', 'executable description');
      const scriptPath = path.resolve(gLocalDirectory, 'script');
      program.parse(['node', scriptPath, 'sub']);
      const sourceExt = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];
      sourceExt.forEach((ext) => {
        expect(existsSpy).toHaveBeenCalledWith(
          path.resolve(gLocalDirectory, `script-sub${ext}`),
        );
      });
    });
  });
});
