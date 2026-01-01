const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Testing variadic arguments.

describe('variadic argument', () => {
  test('when no extra arguments specified for program then variadic arg is empty array', (t) => {
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    program.arguments('<id> [variadicArg...]').action(actionMock);

    program.parse(['node', 'test', 'id']);

    const callArgs = actionMock.mock.calls[0].arguments;
    assert.strictEqual(callArgs[0], 'id');
    assert.deepStrictEqual(callArgs[1], []);
  });

  test('when extra arguments specified for program then variadic arg is array of values', (t) => {
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    program.arguments('<id> [variadicArg...]').action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'id', ...extraArguments]);

    const callArgs = actionMock.mock.calls[0].arguments;
    assert.strictEqual(callArgs[0], 'id');
    assert.deepStrictEqual(callArgs[1], extraArguments);
  });

  test('when no extra arguments specified for command then variadic arg is empty array', (t) => {
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    const cmd = program.command('sub [variadicArg...]').action(actionMock);

    program.parse(['node', 'test', 'sub']);

    const callArgs = actionMock.mock.calls[0].arguments;
    assert.deepStrictEqual(callArgs[0], []);
  });

  test('when extra arguments specified for command then variadic arg is array of values', (t) => {
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    const cmd = program.command('sub [variadicArg...]').action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'sub', ...extraArguments]);

    const callArgs = actionMock.mock.calls[0].arguments;
    assert.deepStrictEqual(callArgs[0], extraArguments);
  });

  test('when program variadic argument not last then error', () => {
    const program = new commander.Command();

    assert.throws(() => {
      program.arguments('<variadicArg...> [optionalArg]');
    }, /only the last argument can be variadic 'variadicArg'/);
  });

  test('when command variadic argument not last then error', () => {
    const program = new commander.Command();

    assert.throws(() => {
      program.command('sub <variadicArg...> [optionalArg]');
    }, /only the last argument can be variadic 'variadicArg'/);
  });

  test('when variadic argument then usage shows variadic', () => {
    const program = new commander.Command();
    program.name('foo').arguments('[args...]');

    assert.equal(program.usage(), '[options] [args...]');
  });
});
