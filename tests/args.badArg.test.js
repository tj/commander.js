const commander = require('../');

test('should throw on bad argument', () => {
  const program = new commander.Command();
  expect(() => program.addArgument(new commander.Argument('bad-format'))).toThrow();
  expect(() => program.argument('bad-format')).toThrow();
});
