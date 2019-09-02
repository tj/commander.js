const commander = require('../');

// Testing variadic arguments. Testing all the action arguments, but could test just variadicArg.

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
  // Using knowledge of implementation to inspect error handling.
  const fakeExit = new Error('exit');
  const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw fakeExit; });
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  const program = new commander.Command();
  program
    .arguments('<variadicArg...> [optionalArg]')
    .action(jest.fn);

  expect(() => {
    program.parse(['node', 'test', 'a']);
  }).toThrow(fakeExit);

  expect(consoleSpy).toHaveBeenCalledWith("error: variadic arguments must be last '%s'", 'variadicArg');
  exitSpy.mockClear();
  consoleSpy.mockClear();
});

test('when command variadic argument not last then error', () => {
  // Using knowledge of implementation to inspect error handling.
  const fakeExit = new Error('exit');
  const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw fakeExit; });
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  const program = new commander.Command();
  program
    .command('sub <variadicArg...> [optionalArg]')
    .action(jest.fn);

  expect(() => {
    program.parse(['node', 'test', 'sub', 'a']);
  }).toThrow(fakeExit);

  expect(consoleSpy).toHaveBeenCalledWith("error: variadic arguments must be last '%s'", 'variadicArg');
  exitSpy.mockClear();
  consoleSpy.mockClear();
});
