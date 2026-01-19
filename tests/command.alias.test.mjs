import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Running alias commands is tested in command.executableSubcommand.lookup.test.js
// Test various other behaviours for .alias

describe('Command aliases using .alias() and .aliases()', () => {
  test('when command has alias then appears in help', () => {
    const program = new commander.Command();
    program.command('info [thing]').alias('i');
    const helpInformation = program.helpInformation();
    assert.match(helpInformation, /info\|i/);
  });

  test('when command has aliases added separately then only first appears in help', () => {
    const program = new commander.Command();
    program.command('list [thing]').alias('ls').alias('dir');
    const helpInformation = program.helpInformation();
    assert.match(helpInformation, /list\|ls /);
  });

  test('when command has aliases then only first appears in help', () => {
    const program = new commander.Command();
    program.command('list [thing]').aliases(['ls', 'dir']);
    const helpInformation = program.helpInformation();
    assert.match(helpInformation, /list\|ls /);
  });

  test('when command name = alias then error', () => {
    const program = new commander.Command();
    assert.throws(
      () => {
        program.command('fail').alias('fail');
      },
      { message: "Command alias can't be the same as its name" },
    );
  });

  test('when use alias then action handler called', (t) => {
    const program = new commander.Command();
    const actionMock = t.mock.fn();
    program.command('list').alias('ls').action(actionMock);
    program.parse(['ls'], { from: 'user' });
    assert.equal(actionMock.mock.callCount(), 1);
  });

  test('when use second alias added separately then action handler called', (t) => {
    const program = new commander.Command();
    const actionMock = t.mock.fn();
    program.command('list').alias('ls').alias('dir').action(actionMock);
    program.parse(['dir'], { from: 'user' });
    assert.equal(actionMock.mock.callCount(), 1);
  });

  test('when use second of aliases then action handler called', (t) => {
    const program = new commander.Command();
    const actionMock = t.mock.fn();
    program.command('list').aliases(['ls', 'dir']).action(actionMock);
    program.parse(['dir'], { from: 'user' });
    assert.equal(actionMock.mock.callCount(), 1);
  });

  test('when set alias then can get alias', () => {
    const program = new commander.Command();
    const alias = 'abcde';
    program.alias(alias);
    assert.equal(program.alias(), alias);
  });

  test('when set aliases then can get aliases', () => {
    const program = new commander.Command();
    const aliases = ['a', 'b'];
    program.aliases(aliases);
    assert.deepEqual(program.aliases(), aliases);
  });

  test('when set alias on executable then can get alias', () => {
    const program = new commander.Command();
    const alias = 'abcde';
    program.command('external', 'external command').alias(alias);
    assert.equal(program.commands[0].alias(), alias);
  });
});

describe('Command.aliases() parameter is treated as readonly, per TypeScript declaration', () => {
  test('when .aliases() called then parameter does not change', () => {
    // Unlikely this could break, but check the API we are declaring in TypeScript.
    const original = ['b', 'bld'];
    const param = original.slice();
    new commander.Command('build').aliases(param);
    assert.deepEqual(param, original);
  });

  test('when .aliases() called and aliases later changed then parameter does not change', () => {
    const original = ['b', 'bld'];
    const param = original.slice();
    const cmd = new commander.Command('build').aliases(param);
    cmd.alias('BBB');
    assert.deepEqual(param, original);
  });

  test('when .aliases() called and parameter later changed then aliases does not change', () => {
    const original = ['b', 'bld'];
    const param = original.slice();
    const cmd = new commander.Command('build').aliases(param);
    param.length = 0;
    assert.deepEqual(cmd.aliases(), original);
  });
});
