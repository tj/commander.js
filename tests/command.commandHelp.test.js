const commander = require('../');

// This is a ported legacy test.

test('when program has command then appears in help', () => {
  const program = new commander.Command();
  program
    .command('bare');
  const commandHelp = program.helpInformation();
  expect(commandHelp).toMatch(/Commands:\n +bare\n/);
});

test('when program has command with optional arg then appears in help', () => {
  const program = new commander.Command();
  program
    .command('bare [bare-arg]');
  const commandHelp = program.helpInformation();
  expect(commandHelp).toMatch(/Commands:\n +bare \[bare-arg\]\n/);
});
