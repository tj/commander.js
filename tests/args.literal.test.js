const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

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
});
