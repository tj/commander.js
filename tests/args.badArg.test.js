const commander = require('../');

test('when unexpected argument format then throw', () => {
  const program = new commander.Command();
  expect(() => program.addArgument(new commander.Argument('bad-format'))).toThrow();
  expect(() => program.argument('bad-format')).toThrow();
});
