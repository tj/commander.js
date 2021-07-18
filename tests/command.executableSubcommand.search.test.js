const childProcess = require('child_process');
const fs = require('fs');
const commander = require('../');

// This file does in-process mocking.
// See also command.executableSubcommand.lookup.test.js

function extractMockSpawnArgs(mock) {
  expect(mock).toHaveBeenCalled();
  // child_process.spawn(command[, args][, options])
  return mock.mock.calls[0][1];
}

function extractMockSpawnCommand(mock) {
  expect(mock).toHaveBeenCalled();
  // child_process.spawn(command[, args][, options])
  return mock.mock.calls[0][0];
}

describe('search tests', () => {
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

  test('when no script arg or executableDir then no search for local file', () => {
    existsSpy.mockImplementation(() => false);
    const program = new commander.Command();
    program.name('pm');
    program.command('sub', 'executable description');
    program.parse(['sub'], { from: 'user' });

    expect(existsSpy).not.toHaveBeenCalled();
  });

  test('when script arg then search for local files', () => {
    existsSpy.mockImplementation(() => false);
    const program = new commander.Command();
    program.name('pm');
    program.command('sub', 'executable description');
    program.parse(['node', 'script-name', 'sub']);

    expect(existsSpy).toHaveBeenCalled();
  });

  test('when executableDir then search for local files)', () => {
    existsSpy.mockImplementation(() => false);
    const program = new commander.Command();
    program.name('pm');
    program.executableDir(__dirname);
    program.command('sub', 'executable description');
    program.parse(['sub'], { from: 'user' });

    expect(existsSpy).toHaveBeenCalled();
  });

  test('when no script arg or executableDir then spawn program-sub (in PATH)', () => {
    existsSpy.mockImplementation(() => false);
    const program = new commander.Command();
    program.name('pm');
    program.command('sub', 'executable description');
    program.parse(['sub'], { from: 'user' });

    expect(extractMockSpawnCommand(spawnSpy)).toEqual('pm-sub');
  });

  test('when program named and script arg then spawn program-sub (in PATH)', () => {
    existsSpy.mockImplementation(() => false);
    const program = new commander.Command();
    program.name('pm');
    program.command('sub', 'executable description');
    program.parse(['node', 'script-name', 'sub']);

    expect(extractMockSpawnCommand(spawnSpy)).toEqual('pm-sub');
  });

  test('when program not named and script path arg then spawn script-sub (in PATH)', () => {
    existsSpy.mockImplementation(() => false);
    const program = new commander.Command();
    program.command('sub', 'executable description');
    program.parse(['node', 'script.js', 'sub']);

    expect(extractMockSpawnCommand(spawnSpy)).toEqual('script-sub');
  });

  // search directory
  // - script path
  // - script path symlink
  // - executableDir
  // legacy lookup
});
