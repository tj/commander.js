const commander = require('../');

test('when command has alias then appears in help', () => {
  const program = new commander.Command();
  program
    .command('info [thing]')
    .alias('i');
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('info|i');
});
