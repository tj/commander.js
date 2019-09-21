const commander = require('../');

// Testing variadic arguments. Testing all the action arguments, but could test just variadicArg.

describe('.version', () => {
  // Optional. Use internal knowledge to suppress output to keep test output clean.
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  test('when no extra arguments specified for program then variadic arg is empty array', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program
      .arguments('<id> [variadicArg...]')
      .action(actionMock);

    program.parse(['node', 'test', 'id']);

    expect(actionMock).toHaveBeenCalledWith('id', [], program);
  });

  test('when extra arguments specified for program then variadic arg is array of values', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program
      .arguments('<id> [variadicArg...]')
      .action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'id', ...extraArguments]);

    expect(actionMock).toHaveBeenCalledWith('id', extraArguments, program);
  });

  test('when no extra arguments specified for command then variadic arg is empty array', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    const cmd = program
      .command('sub [variadicArg...]')
      .action(actionMock);

    program.parse(['node', 'test', 'sub']);

    expect(actionMock).toHaveBeenCalledWith([], cmd);
  });

  test('when extra arguments specified for command then variadic arg is array of values', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    const cmd = program
      .command('sub [variadicArg...]')
      .action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'sub', ...extraArguments]);

    expect(actionMock).toHaveBeenCalledWith(extraArguments, cmd);
  });

  test('when program variadic argument not last then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .arguments('<variadicArg...> [optionalArg]')
      .action(jest.fn);

    expect(() => {
      program.parse(['node', 'test', 'a']);
    }).toThrow("error: variadic arguments must be last 'variadicArg'");
  });

  test('when command variadic argument not last then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('sub <variadicArg...> [optionalArg]')
      .action(jest.fn);

    expect(() => {
      program.parse(['node', 'test', 'sub', 'a']);
    }).toThrow("error: variadic arguments must be last 'variadicArg'");
  });
});
