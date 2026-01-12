const commander = require('../');
const { createTestCommand } = require('./testHelpers');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// .command('*') is the old main/default command handler. It adds a listener
// for 'command:*'. It has been somewhat replaced by the program action handler,
// so most uses are probably old code. Current plan is keep the code backwards compatible
// and put work in elsewhere for new code (e.g. evolving behaviour for program action handler).
//
// The event 'command:*' is also listened for directly for testing for unknown commands
// due to an example in the README.
//
// Historical: the event 'command:*' used to also be shared by the action handler on the program.

describe("Command.command('*')", () => {
  test('when no arguments then asterisk action not called', (t) => {
    const mockAction = t.mock.fn();
    const program = createTestCommand();
    program.command('*').action(mockAction);
    try {
      program.parse(['node', 'test']);
    } catch (err) {
      /* empty */
    }
    assert.equal(mockAction.mock.callCount(), 0);
  });

  test('when unrecognised argument then asterisk action called', (t) => {
    const mockAction = t.mock.fn();
    const program = new commander.Command();
    program.command('*').argument('[args...]').action(mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    assert.equal(mockAction.mock.callCount(), 1);
  });

  test('when recognised command then asterisk action not called', (t) => {
    const mockAction = t.mock.fn();
    const program = new commander.Command();
    program.command('install').action(() => {});
    program.command('*').action(mockAction);
    program.parse(['node', 'test', 'install']);
    assert.equal(mockAction.mock.callCount(), 0);
  });

  test('when unrecognised command/argument then asterisk action called', (t) => {
    const mockAction = t.mock.fn();
    const program = new commander.Command();
    program.command('install');
    program.command('*').argument('[args...]').action(mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    assert.equal(mockAction.mock.callCount(), 1);
  });

  test('when unrecognised argument and known option then asterisk action called', (t) => {
    // This tests for a regression between v4 and v5. Known default option should not be rejected by program.
    const mockAction = t.mock.fn();
    const program = new commander.Command();
    program.command('install');
    const star = program
      .command('*')
      .argument('[args...]')
      .option('-d, --debug')
      .action(mockAction);
    program.parse(['node', 'test', 'unrecognised-command', '--debug']);
    assert.equal(mockAction.mock.callCount(), 1);
    assert.equal(star.opts().debug, true);
  });

  test('when non-command argument and unknown option then error for unknown option', (t) => {
    // This is a change in behaviour from v2 which did not error, but is consistent with modern better detection of invalid options
    const mockAction = t.mock.fn();
    const program = createTestCommand();
    program.command('install');
    program.command('*').argument('[args...]').action(mockAction);
    assert.throws(
      () => {
        program.parse(['node', 'test', 'some-argument', '--unknown']);
      },
      {
        code: 'commander.unknownOption',
      },
    );
  });
});

// Test .on explicitly rather than assuming covered by .command
describe("Command.on('command:*')", () => {
  test('when no arguments then listener not called', (t) => {
    const mockAction = t.mock.fn();
    const program = new commander.Command();
    program.on('command:*', mockAction);
    program.parse(['node', 'test']);
    assert.equal(mockAction.mock.callCount(), 0);
  });

  test('when unrecognised argument then listener called', (t) => {
    const mockAction = t.mock.fn();
    const program = new commander.Command();
    program.on('command:*', mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    assert.equal(mockAction.mock.callCount(), 1);
  });

  test('when recognised command then listener not called', (t) => {
    const mockAction = t.mock.fn();
    const program = new commander.Command();
    program.command('install').action(() => {});
    program.on('command:*', mockAction);
    program.parse(['node', 'test', 'install']);
    assert.equal(mockAction.mock.callCount(), 0);
  });

  test('when unrecognised command/argument then listener called', (t) => {
    const mockAction = t.mock.fn();
    const program = new commander.Command();
    program.command('install');
    program.on('command:*', mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    assert.equal(mockAction.mock.callCount(), 1);
  });

  test('when unrecognised command/argument and unknown option then listener called', (t) => {
    // Give listener a chance to make a suggestion for misspelled command. The option
    // could only be unknown because the command is not correct.
    // Regression identified in https://github.com/tj/commander.js/issues/1460#issuecomment-772313494
    const mockAction = t.mock.fn();
    const program = new commander.Command();
    program.command('install');
    program.on('command:*', mockAction);
    program.parse(['node', 'test', 'intsall', '--unknown']);
    assert.equal(mockAction.mock.callCount(), 1);
  });
});
