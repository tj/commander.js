import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Do some low-level checks that the multiple ways of specifying command arguments produce same internal result,
// and not exhaustively testing all methods elsewhere.

describe('Command arguments added using different methods', () => {
  test('when add "<arg>" then argument required', async (t) => {
    for (const [methodName, cmd] of getSingleArgCases('<explicit-required>')) {
      await t.test(`using ${methodName}`, () => {
        const argument = cmd.registeredArguments[0];
        assert.equal(argument._name, 'explicit-required');
        assert.equal(argument.required, true);
        assert.equal(argument.variadic, false);
        assert.equal(argument.description, '');
      });
    }
  });

  test('when add "arg" then argument required', async (t) => {
    for (const [methodName, cmd] of getSingleArgCases('implicit-required')) {
      await t.test(`using ${methodName}`, () => {
        const argument = cmd.registeredArguments[0];
        assert.equal(argument._name, 'implicit-required');
        assert.equal(argument.required, true);
        assert.equal(argument.variadic, false);
        assert.equal(argument.description, '');
      });
    }
  });

  test('when add "[arg]" then argument optional', async (t) => {
    for (const [methodName, cmd] of getSingleArgCases('[optional]')) {
      await t.test(`using ${methodName}`, () => {
        const argument = cmd.registeredArguments[0];
        assert.equal(argument._name, 'optional');
        assert.equal(argument.required, false);
        assert.equal(argument.variadic, false);
        assert.equal(argument.description, '');
      });
    }
  });

  test('when add "<arg...>" then argument required and variadic', async (t) => {
    for (const [methodName, cmd] of getSingleArgCases(
      '<explicit-required...>',
    )) {
      await t.test(`using ${methodName}`, () => {
        const argument = cmd.registeredArguments[0];
        assert.equal(argument._name, 'explicit-required');
        assert.equal(argument.required, true);
        assert.equal(argument.variadic, true);
        assert.equal(argument.description, '');
      });
    }
  });

  test('when add "arg..." then argument required and variadic', async (t) => {
    for (const [methodName, cmd] of getSingleArgCases('implicit-required...')) {
      await t.test(`using ${methodName}`, () => {
        const argument = cmd.registeredArguments[0];
        assert.equal(argument._name, 'implicit-required');
        assert.equal(argument.required, true);
        assert.equal(argument.variadic, true);
        assert.equal(argument.description, '');
      });
    }
  });

  test('when add "[arg...]" then argument optional and variadic', async (t) => {
    for (const [methodName, cmd] of getSingleArgCases('[optional...]')) {
      await t.test(`using ${methodName}`, () => {
        const argument = cmd.registeredArguments[0];
        assert.equal(argument._name, 'optional');
        assert.equal(argument.required, false);
        assert.equal(argument.variadic, true);
        assert.equal(argument.description, '');
      });
    }
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

  test('when add two arguments then two arguments', async (t) => {
    for (const [methodName, cmd] of getMultipleArgCases(
      '<first>',
      '[second]',
    )) {
      await t.test(`using ${methodName}`, () => {
        assert.equal(cmd.registeredArguments[0].name(), 'first');
        assert.equal(cmd.registeredArguments[1].name(), 'second');
      });
    }
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
    assert.deepEqual(argNames, [
      'arg1',
      'arg2',
      'arg3',
      'arg4',
      'arg5',
      'arg6',
    ]);
  });
});
