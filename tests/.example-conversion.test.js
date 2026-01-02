const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict'); // strict assertion mode

// Key patterns for conversion from Jest to node:test
// - Jest comments are for example file only and original code does not need to be retained in comments
// - use assert.equal for primitives, and assert.deepEqual for objects
// - use assert.equal rather than assert.strictEqual (already in strict assertion mode)
// - use assert.deepEqual rather than assert.strictDeepEqual (already in strict assertion mode)
// - convert Jest describe to node:test describe
// - convert jest.fn() to use node:test t.mock.fn()
// - convert expect().toHaveBeenCalled() to assert.equal(callCount, 1)

test('when arguments includes -- then stop processing options', () => {
  const program = new commander.Command();
  program
    .option('-f, --foo', 'add some foo')
    .option('-b, --bar', 'add some bar')
    .argument('[args...]');
  program.parse(['node', 'test', '--foo', '--', '--bar', 'baz']);
  // More than one assert, ported from legacy test
  const opts = program.opts();
  // Jest was: expect(opts.foo).toBe(true);
  assert.equal(opts.foo, true);
  // Jest was: expect(opts.bar).toBeUndefined();
  assert.equal(opts.bar, undefined);
  // Jest was: expect(program.args).toEqual(['--bar', 'baz']);
  assert.deepEqual(program.args, ['--bar', 'baz']);
});

describe('variadic argument', () => {
  test('when no extra arguments specified for program then variadic arg is empty array', (t) => {
    // Jest was: const actionMock = jest.fn();
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    program.arguments('<id> [variadicArg...]').action(actionMock);

    program.parse(['node', 'test', 'id']);

    // Jest was expect(actionMock).toHaveBeenCalledWith('id', [], program.opts(), program);
    const callArgs = actionMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], 'id');
    assert.deepEqual(callArgs[1], []);
    assert.equal(callArgs[2], program.opts()); // check same object
    assert.equal(callArgs[3], program); // check same object
  });
});

test('when use alias then action handler called', (t) => {
  const program = new commander.Command();
  const actionMock = t.mock.fn();
  program.command('list').alias('ls').action(actionMock);
  program.parse(['ls'], { from: 'user' });
  // Jest was: expect(actionMock).toHaveBeenCalled();
  assert.equal(actionMock.mock.callCount(), 1);
});
