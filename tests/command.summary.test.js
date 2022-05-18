const commander = require('../');

test('when set summary then get summary', () => {
  const program = new commander.Command();
  const summary = 'abcdef';
  program.summary(summary);
  expect(program.summary()).toMatch(summary);
});
