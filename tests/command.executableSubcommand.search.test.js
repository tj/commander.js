const childProcess = require('child_process');
const fs = require('fs');
const commander = require('../');

// This file does in-process mocking.
// See also command.executableSubcommand.lookup.test.js

// function extractMockSpawnArgs(mock) {
//   expect(mock).toHaveBeenCalled();
//   // child_process.spawn(command[, args][, options])
//   return mock.mock.calls[0][1];
// }

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

  // search (needs a directory)
  // - arg pwd/script searches in pwd
  // - executableDir searches in executableDir
  // - named pm, dir, local pm-sub (Mac/Win difference in whether uses node)
  // - named pm, dir, local pm-sub.js
  // - arg pwd/script, local script-sub.js
  // - arg pwd/script.js, local script-sub.js
  // - arg symlink to pwd/script.js, local symlink-sub.js [LEGACY]
  // - relative executableDir + scriptDir
  // - relative scriptDir alone (no)
  // - relative executableDir (no)
});
