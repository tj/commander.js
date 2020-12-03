const commander = require('../');

// Utility Conventions: http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html#tag_12_02
//
// 12.2 Utility Syntax Guidelines, Guideline 10:
// The first -- argument that is not an option-argument should be accepted as a delimiter indicating the end of options. Any following arguments should be treated as operands, even if they begin with the '-' character.

test('when arguments includes -- then stop processing options', () => {
  const program = new commander.Command();
  program
    .option('-f, --foo', 'add some foo')
    .option('-b, --bar', 'add some bar');
  program.parse(['node', 'test', '--foo', '--', '--bar', 'baz']);
  // More than one assert, ported from legacy test
  const opts = program.opts();
  expect(opts.foo).toBe(true);
  expect(opts.bar).toBeUndefined();
  expect(program.args).toEqual(['--bar', 'baz']);
});

test('when arguments include -- then more literals are passed-through as args', () => {
  const program = new commander.Command();
  program
    .option('-f, --foo', 'add some foo')
    .option('-b, --bar', 'add some bar');
  program.parse(['node', 'test', '--', 'cmd', '--', '--arg']);
  expect(program.args).toEqual(['cmd', '--', '--arg']);
});
