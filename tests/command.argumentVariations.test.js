const commander = require('../');

// Do some low-level checks that the multiple ways of specifying command arguments produce same internal result,
// and not exhaustively testing all methods elsewhere.

test.each(getTestCases('<explicit-required>'))('when add "<arg>" via %s then argument required', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'explicit-required',
    required: true,
    variadic: false,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

test.each(getTestCases('implicit-required'))('when add "arg" via %s then argument required', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'implicit-required',
    required: true,
    variadic: false,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

test.each(getTestCases('[optional]'))('when add "[arg]" via %s then argument optional', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'optional',
    required: false,
    variadic: false,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

test.each(getTestCases('<explicit-required...>'))('when add "<arg...>" via %s then argument required and variadic', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'explicit-required',
    required: true,
    variadic: true,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

test.each(getTestCases('implicit-required...'))('when add "arg..." via %s then argument required and variadic', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'implicit-required',
    required: true,
    variadic: true,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

test.each(getTestCases('[optional...]'))('when add "[arg...]" via %s then argument optional and variadic', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'optional',
    required: false,
    variadic: true,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

function getTestCases(arg) {
  return [
    ['.arguments', new commander.Command().arguments(arg)],
    ['.argument', new commander.Command().argument(arg)],
    ['.addArgument', new commander.Command('add-argument').addArgument(new commander.Argument(arg))],
    ['.command', new commander.Command().command(`command ${arg}`)]
  ];
}
