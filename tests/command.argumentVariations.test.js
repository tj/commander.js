const commander = require('../');

// Do some low-level checks that the multiple ways of specifying command arguments produce same internal result,
// and not exhaustively testing all methods elsewhere.

test.each(getSingleArgCases('<explicit-required>'))('when add "<arg>" using %s then argument required', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'explicit-required',
    required: true,
    variadic: false,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

test.each(getSingleArgCases('implicit-required'))('when add "arg" using %s then argument required', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'implicit-required',
    required: true,
    variadic: false,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

test.each(getSingleArgCases('[optional]'))('when add "[arg]" using %s then argument optional', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'optional',
    required: false,
    variadic: false,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

test.each(getSingleArgCases('<explicit-required...>'))('when add "<arg...>" using %s then argument required and variadic', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'explicit-required',
    required: true,
    variadic: true,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

test.each(getSingleArgCases('implicit-required...'))('when add "arg..." using %s then argument required and variadic', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'implicit-required',
    required: true,
    variadic: true,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

test.each(getSingleArgCases('[optional...]'))('when add "[arg...]" using %s then argument optional and variadic', (methodName, cmd) => {
  const argument = cmd._args[0];
  const expectedShape = {
    _name: 'optional',
    required: false,
    variadic: true,
    description: ''
  };
  expect(argument).toEqual(expectedShape);
});

function getSingleArgCases(arg) {
  return [
    ['.arguments', new commander.Command().arguments(arg)],
    ['.argument', new commander.Command().argument(arg)],
    ['.addArgument', new commander.Command('add-argument').addArgument(new commander.Argument(arg))],
    ['.command', new commander.Command().command(`command ${arg}`)]
  ];
}

test.each(getMultipleArgCases('<first>', '[second]'))('when add two arguments using %s then two arguments', (methodName, cmd) => {
  expect(cmd._args[0].name()).toEqual('first');
  expect(cmd._args[1].name()).toEqual('second');
});

function getMultipleArgCases(arg1, arg2) {
  return [
    ['.arguments', new commander.Command().arguments(`${arg1} ${arg2}`)],
    ['.argument', new commander.Command().argument(arg1).argument(arg2)],
    ['.addArgument', new commander.Command('add-argument').addArgument(new commander.Argument(arg1)).addArgument(new commander.Argument(arg2))],
    ['.command', new commander.Command().command(`command ${arg1} ${arg2}`)]
  ];
}

test('when add arguments using multiple methods then all added', () => {
  // This is not a key use case, but explicitly test that additive behaviour.
  const program = new commander.Command();
  const cmd = program.command('sub <arg1> <arg2>');
  cmd.arguments('<arg3> <arg4>');
  cmd.argument('<arg5>');
  cmd.addArgument(new commander.Argument('arg6'));
  const argNames = cmd._args.map(arg => arg.name());
  expect(argNames).toEqual(['arg1', 'arg2', 'arg3', 'arg4', 'arg5', 'arg6']);
});
