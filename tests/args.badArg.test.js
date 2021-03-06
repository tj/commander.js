const commander = require('../');

test('should throw on bad argument', () => {
  const program = new commander.Command();
  expect(() => program.addArgument(new commander.Argument('bad name'))).toThrowError('Bad argument format: bad name');
  expect(() => program.argument(new commander.Argument('bad name'))).toThrowError('Bad argument format: bad name');
});
