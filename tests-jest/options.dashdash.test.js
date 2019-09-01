const commander = require('../');

// Guideline 10:
// The first -- argument that is not an option-argument should be accepted as a delimiter indicating the end of options. Any following arguments should be treated as operands, even if they begin with the '-' character.
//
// http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html#tag_12_02

test('when argument is -- then stop processing options', () => {
  const program = new commander.Command();
  program
    .arguments('[rest...]')
    .option('--pepper', 'add pepper');
  program.parse(['node', 'test', '--', '--pepper']);
  expect(program.pepper).toBeUndefined();
  expect(program.args).toEqual(['--pepper']);
});
