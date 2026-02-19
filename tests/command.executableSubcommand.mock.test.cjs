const commander = require('../');
const childProcess = require('child_process');
const EventEmitter = require('events');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Using mocking of child_process.spawn. Not fully supported yet in esm by node:test so run as cjs.

// Using mock to allow try/catch around what is otherwise out-of-stack error handling.
// Injecting errors, these are not end-to-end tests.

function makeSystemError(code) {
  // We can not make an actual SystemError, but our usage is lightweight so easy to match.
  const err = new Error();
  err.code = code;
  return err;
}

// Suppress false positive warnings due to use of testOrSkipOnWindows

const testOrSkipOnWindows = process.platform === 'win32' ? test.skip : test;

describe('executable subcommand missing file handling ', () => {
  testOrSkipOnWindows(
    'when subcommand executable missing (ENOENT) then throw custom message',
    (t) => {
      // If the command is not found, we show a custom error with an explanation and offer
      // some advice for possible fixes.
      const mockProcess = new EventEmitter();
      t.mock.method(childProcess, 'spawn', () => {
        return mockProcess;
      });
      const program = new commander.Command();
      program.exitOverride();
      program.command('executable', 'executable description');
      program.parse(['executable'], { from: 'user' });
      assert.throws(() => {
        mockProcess.emit('error', makeSystemError('ENOENT'));
      }, /use the executableFile option to supply a custom name/); // part of custom message
    },
  );

  testOrSkipOnWindows(
    'when subcommand executable not executable (EACCES) then throw custom message',
    (t) => {
      const mockProcess = new EventEmitter();
      t.mock.method(childProcess, 'spawn', () => {
        return mockProcess;
      });
      const program = new commander.Command();
      program.exitOverride();
      program.command('executable', 'executable description');
      program.parse(['executable'], { from: 'user' });
      assert.throws(() => {
        mockProcess.emit('error', makeSystemError('EACCES'));
      }, /not executable/); // part of custom message
    },
  );

  test('when subcommand executable fails with other error and exitOverride then return in custom wrapper', (t) => {
    // The existing behaviour is to just silently fail for unexpected errors, as it is happening
    // asynchronously in spawned process and client can not catch errors.
    const mockProcess = new EventEmitter();
    t.mock.method(childProcess, 'spawn', () => {
      return mockProcess;
    });
    const program = new commander.Command();
    program._checkForMissingExecutable = () => {}; // suppress error, call mocked spawn
    program.exitOverride((err) => {
      throw err;
    });
    program.command('executable', 'executable description');
    program.parse(['executable'], { from: 'user' });
    assert.throws(
      () => {
        mockProcess.emit('error', makeSystemError('OTHER'));
      },
      (err) => {
        assert.equal(err.code, 'commander.executeSubCommandAsync');
        assert.equal(err.nestedError.code, 'OTHER');
        return true;
      },
    );
  });

  test('when subcommand executable fails with other error then exit', (t) => {
    // The existing behaviour is to just silently fail for unexpected errors, as it is happening
    // asynchronously in spawned process and client can not catch errors.
    const mockProcess = new EventEmitter();
    t.mock.method(childProcess, 'spawn', () => {
      return mockProcess;
    });
    const exitSpy = t.mock.method(process, 'exit', () => {});
    const program = new commander.Command();
    program._checkForMissingExecutable = () => {}; // suppress error, call mocked spawn
    program.command('executable', 'executable description');
    program.parse(['executable'], { from: 'user' });
    mockProcess.emit('error', makeSystemError('OTHER'));
    assert.equal(exitSpy.mock.callCount(), 1);
    const callArgs = exitSpy.mock.calls[0].arguments;
    assert.equal(callArgs[0], 1);
  });
});
