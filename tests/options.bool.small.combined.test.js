const commander = require('../');

test('when when multiple short flags specified then all values are true', () => {
  const program = new commander.Command();
  program
    .option('-p, --pepper', 'add pepper')
    .option('-c, --cheese', 'add cheese');

  program.parse(['node', 'test', '-pc']);

  expect(program.opts().pepper).toBe(true);
  expect(program.opts().cheese).toBe(true);
});
