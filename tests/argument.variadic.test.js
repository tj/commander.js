const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Testing variadic arguments. Testing all the action arguments, but could test just variadicArg.

describe('Command variadic argument using .argument()', (t) => {
  test('when no extra arguments specified for program then variadic arg is empty array', (t) => {
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    program.argument('<id>').argument('[variadicArg...]').action(actionMock);

    program.parse(['node', 'test', 'id']);

    const callArgs = actionMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], 'id');
    assert.deepEqual(callArgs[1], []);
  });

  test('when extra arguments specified for program then variadic arg is array of values', (t) => {
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    program
      .addArgument(new commander.Argument('<id>'))
      .argument('[variadicArg...]')
      .action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'id', ...extraArguments]);

    const callArgs = actionMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], 'id');
    assert.deepEqual(callArgs[1], extraArguments);
  });

  test('when no extra arguments specified for command then variadic arg is empty array', (t) => {
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    const cmd = program.command('sub [variadicArg...]').action(actionMock);

    program.parse(['node', 'test', 'sub']);

    const callArgs = actionMock.mock.calls[0].arguments;
    assert.deepEqual(callArgs[0], []);
  });

  test('when extra arguments specified for command then variadic arg is array of values', (t) => {
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    const cmd = program.command('sub [variadicArg...]').action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'sub', ...extraArguments]);

    const callArgs = actionMock.mock.calls[0].arguments;
    assert.deepEqual(callArgs[0], extraArguments);
  });

  test('when program variadic argument not last then error', () => {
    const program = new commander.Command();

    assert.throws(() => {
      program.argument('<variadicArg...>').argument('[optionalArg]');
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
    program.name('foo').argument('[args...]');

    assert.equal(program.usage(), '[options] [args...]');
  });

  test('when variadic used with choices and one value then set in array', () => {
    const program = new commander.Command();
    let passedArg;
    program
      .addArgument(new commander.Argument('<value...>').choices(['one', 'two']))
      .action((value) => {
        passedArg = value;
      });

    program.parse(['one'], { from: 'user' });
    assert.deepEqual(passedArg, ['one']);
  });

  test('when variadic used with choices and two values then set in array', () => {
    const program = new commander.Command();
    let passedArg;
    program
      .addArgument(new commander.Argument('<value...>').choices(['one', 'two']))
      .action((value) => {
        passedArg = value;
      });

    program.parse(['one', 'two'], { from: 'user' });
    assert.deepEqual(passedArg, ['one', 'two']);
  });

  test('when variadic has default array then specified value is used instead of default (not appended)', () => {
    const program = new commander.Command();
    let passedArg;
    program
      .addArgument(new commander.Argument('[value...]').default(['DEFAULT']))
      .action((value) => {
        passedArg = value;
      });

    program.parse(['one', 'two'], { from: 'user' });
    assert.deepEqual(passedArg, ['one', 'two']);
  });
});
