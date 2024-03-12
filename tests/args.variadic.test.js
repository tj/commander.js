const commander = require('../');

// Testing variadic arguments. Testing all the action arguments, but could test just variadicArg.

describe('variadic argument', () => {
  test('when no extra arguments specified for program then variadic arg is empty array', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program.arguments('<id> [variadicArg...]').action(actionMock);

    program.parse(['node', 'test', 'id']);

    expect(actionMock).toHaveBeenCalledWith('id', [], program.opts(), program);
  });

  test('when extra arguments specified for program then variadic arg is array of values', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program.arguments('<id> [variadicArg...]').action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'id', ...extraArguments]);

    expect(actionMock).toHaveBeenCalledWith(
      'id',
      extraArguments,
      program.opts(),
      program,
    );
  });

  test('when no extra arguments specified for command then variadic arg is empty array', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    const cmd = program.command('sub [variadicArg...]').action(actionMock);

    program.parse(['node', 'test', 'sub']);

    expect(actionMock).toHaveBeenCalledWith([], cmd.opts(), cmd);
  });

  test('when extra arguments specified for command then variadic arg is array of values', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    const cmd = program.command('sub [variadicArg...]').action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'sub', ...extraArguments]);

    expect(actionMock).toHaveBeenCalledWith(extraArguments, cmd.opts(), cmd);
  });

  test('when program variadic argument not last then error', () => {
    const program = new commander.Command();

    expect(() => {
      program.arguments('<variadicArg...> [optionalArg]');
    }).toThrow("only the last argument can be variadic 'variadicArg'");
  });

  test('when command variadic argument not last then error', () => {
    const program = new commander.Command();

    expect(() => {
      program.command('sub <variadicArg...> [optionalArg]');
    }).toThrow("only the last argument can be variadic 'variadicArg'");
  });

  test('when variadic argument then usage shows variadic', () => {
    const program = new commander.Command();
    program.name('foo').arguments('[args...]');

    expect(program.usage()).toBe('[options] [args...]');
  });
});
