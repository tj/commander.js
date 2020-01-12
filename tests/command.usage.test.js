const commander = require('../');

test('when default usage and check program help then starts with default usage', () => {
  const program = new commander.Command();

  program._name = 'hack';
  const helpInformation = program.helpInformation();

  expect(helpInformation).toMatch(new RegExp('^Usage: hack \\[options\\]'));
});

test('when custom usage and check program help then starts with custom usage', () => {
  const myUsage = 'custom';
  const program = new commander.Command();
  program
    .usage(myUsage);

  program._name = 'hack';
  const helpInformation = program.helpInformation();

  expect(helpInformation).toMatch(new RegExp(`^Usage: hack ${myUsage}`));
});

test('when default usage and check subcommand help then starts with default usage including program name', () => {
  const program = new commander.Command();
  const subCommand = program
    .command('info');

  program._name = 'hack';
  const helpInformation = subCommand.helpInformation();

  expect(helpInformation).toMatch(new RegExp('^Usage: hack info \\[options\\]'));
});

test('when custom usage and check subcommand help then starts with custom usage including program name', () => {
  const myUsage = 'custom';
  const program = new commander.Command();
  const subCommand = program
    .command('info')
    .usage(myUsage);

  program._name = 'hack';
  const helpInformation = subCommand.helpInformation();

  expect(helpInformation).toMatch(new RegExp(`^Usage: hack info ${myUsage}`));
});
