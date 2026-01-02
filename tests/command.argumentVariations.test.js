const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Do some low-level checks that the multiple ways of specifying command arguments produce same internal result,
// and not exhaustively testing all methods elsewhere.

describe('when add "<arg>" then argument required', () => {
  getSingleArgCases('<explicit-required>').forEach(([methodName, cmd]) => {
    test(`using ${methodName}`, () => {
      const argument = cmd.registeredArguments[0];
      assert.equal(argument._name, 'explicit-required');
      assert.equal(argument.required, true);
      assert.equal(argument.variadic, false);
      assert.equal(argument.description, '');
    });
  });
});

describe('when add "arg" then argument required', () => {
  getSingleArgCases('implicit-required').forEach(([methodName, cmd]) => {
    test(`using ${methodName}`, () => {
      const argument = cmd.registeredArguments[0];
      assert.equal(argument._name, 'implicit-required');
      assert.equal(argument.required, true);
      assert.equal(argument.variadic, false);
      assert.equal(argument.description, '');
    });
  });
});

describe('when add "[arg]" then argument optional', () => {
  getSingleArgCases('[optional]').forEach(([methodName, cmd]) => {
    test(`using ${methodName}`, () => {
      const argument = cmd.registeredArguments[0];
      assert.equal(argument._name, 'optional');
      assert.equal(argument.required, false);
      assert.equal(argument.variadic, false);
      assert.equal(argument.description, '');
    });
  });
});

describe('when add "<arg...>" then argument required and variadic', () => {
  getSingleArgCases('<explicit-required...>').forEach(([methodName, cmd]) => {
    test(`using ${methodName}`, () => {
      const argument = cmd.registeredArguments[0];
      assert.equal(argument._name, 'explicit-required');
      assert.equal(argument.required, true);
      assert.equal(argument.variadic, true);
      assert.equal(argument.description, '');
    });
  });
});

describe('when add "arg..." then argument required and variadic', () => {
  getSingleArgCases('implicit-required...').forEach(([methodName, cmd]) => {
    test(`using ${methodName}`, () => {
      const argument = cmd.registeredArguments[0];
      assert.equal(argument._name, 'implicit-required');
      assert.equal(argument.required, true);
      assert.equal(argument.variadic, true);
      assert.equal(argument.description, '');
    });
  });
});

describe('when add "[arg...]" then argument optional and variadic', () => {
  getSingleArgCases('[optional...]').forEach(([methodName, cmd]) => {
    test(`using ${methodName}`, () => {
      const argument = cmd.registeredArguments[0];
      assert.equal(argument._name, 'optional');
      assert.equal(argument.required, false);
      assert.equal(argument.variadic, true);
      assert.equal(argument.description, '');
    });
  });
});

function getSingleArgCases(arg) {
  return [
    ['.arguments', new commander.Command().arguments(arg)],
    ['.argument', new commander.Command().argument(arg)],
    [
      '.addArgument',
      new commander.Command('add-argument').addArgument(
        new commander.Argument(arg),
      ),
    ],
    ['.command', new commander.Command().command(`command ${arg}`)],
  ];
}

describe('when add two arguments then two arguments', () => {
  getMultipleArgCases('<first>', '[second]').forEach(([methodName, cmd]) => {
    test(`using ${methodName}`, () => {
      assert.equal(cmd.registeredArguments[0].name(), 'first');
      assert.equal(cmd.registeredArguments[1].name(), 'second');
    });
  });
});

function getMultipleArgCases(arg1, arg2) {
  return [
    ['.arguments', new commander.Command().arguments(`${arg1} ${arg2}`)],
    ['.argument', new commander.Command().argument(arg1).argument(arg2)],
    [
      '.addArgument',
      new commander.Command('add-argument')
        .addArgument(new commander.Argument(arg1))
        .addArgument(new commander.Argument(arg2)),
    ],
    ['.command', new commander.Command().command(`command ${arg1} ${arg2}`)],
  ];
}

test('when add arguments using multiple methods then all added', () => {
  // This is not a key use case, but explicitly test that additive behaviour.
  const program = new commander.Command();
  const cmd = program.command('sub <arg1> <arg2>');
  cmd.arguments('<arg3> <arg4>');
  cmd.argument('<arg5>');
  cmd.addArgument(new commander.Argument('arg6'));
  const argNames = cmd.registeredArguments.map((arg) => arg.name());
  assert.deepEqual(argNames, ['arg1', 'arg2', 'arg3', 'arg4', 'arg5', 'arg6']);
});
