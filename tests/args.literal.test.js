import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Utility Conventions: http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html#tag_12_02
//
// 12.2 Utility Syntax Guidelines, Guideline 10:
// The first -- argument that is not an option-argument should be accepted as a delimiter indicating the end of options. Any following arguments should be treated as operands, even if they begin with the '-' character.

describe('end of options delimiter "--"', () => {
  test('when arguments includes -- then stop processing options', () => {
    const program = new commander.Command();
    program
      .option('-f, --foo', 'add some foo')
      .option('-b, --bar', 'add some bar')
      .argument('[args...]');
    program.parse(['node', 'test', '--foo', '--', '--bar', 'baz']);
    // More than one assert, ported from legacy test
    const opts = program.opts();
    assert.equal(opts.foo, true);
    assert.equal(opts.bar, undefined);
    assert.deepEqual(program.args, ['--bar', 'baz']);
  });

  test('when arguments include -- then more -- are passed-through as args', () => {
    const program = new commander.Command();
    program
      .option('-f, --foo', 'add some foo')
      .option('-b, --bar', 'add some bar')
      .argument('[args...]');
    program.parse(['node', 'test', '--', 'cmd', '--', '--arg']);
    assert.deepEqual(program.args, ['cmd', '--', '--arg']);
  });

  test('when in-process subcommand has -- then option-like operand is treated as argument', () => {
    const program = new commander.Command();
    const sub = program.command('sub');
    sub.argument('[input]').action((input) => {
      assert.equal(input, '--not-an-option');
    });
    program.parse(['node', 'test', 'sub', '--', '--not-an-option']);
  });

  test('when nested in-process subcommand has -- then option-like operand is treated as argument', () => {
    const program = new commander.Command();
    const sub = program.command('sub');
    const nested = sub.command('nested');
    nested.argument('[input]').action((input) => {
      assert.equal(input, '--not-an-option');
    });
    program.parse([
      'node',
      'test',
      'sub',
      'nested',
      '--',
      '--not-an-option',
    ]);
  });

  test('when in-process subcommand has args before and after -- then all args passed correctly', () => {
    const program = new commander.Command();
    const sub = program.command('sub');
    sub.argument('[args...]').action((args) => {
      assert.deepEqual(args, ['before', '--after']);
    });
    program.parse(['node', 'test', 'sub', 'before', '--', '--after']);
  });
});
