const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// The action handler used to be implemented using command events and listeners.
// Now, this is mostly just for backwards compatibility.

describe(".command('*')", () => {
  test('when action handler for subcommand then emit command:subcommand', (t) => {
    const mockListener = t.mock.fn();
    const program = new commander.Command();
    program.command('sub').action(() => {});
    program.on('command:sub', mockListener);
    program.parse(['sub'], { from: 'user' });
    assert.equal(mockListener.mock.callCount(), 1);
  });

  test('when no action handler for subcommand then still emit command:subcommand', (t) => {
    const mockListener = t.mock.fn();
    const program = new commander.Command();
    program.command('sub');
    program.on('command:sub', mockListener);
    program.parse(['sub'], { from: 'user' });
    assert.equal(mockListener.mock.callCount(), 1);
  });

  test('when subcommand has argument then emit command:subcommand with argument', (t) => {
    const mockListener = t.mock.fn();
    const program = new commander.Command();
    program.command('sub <file>').action(() => {});
    program.on('command:sub', mockListener);
    program.parse(['sub', 'file'], { from: 'user' });
    assert.equal(mockListener.mock.callCount(), 1);
    const callArgs = mockListener.mock.calls[0].arguments;
    assert.deepEqual(callArgs, [['file'], []]);
  });
});
