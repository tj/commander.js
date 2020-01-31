const commander = require('../');

// Note: .commandHelp is not currently documented in the README. This is a ported legacy test.

test('when program has command then appears in commandHelp', () => {
  const program = new commander.Command();
  program
    .command('bare');
  const commandHelp = program.commandHelp();
  expect(commandHelp).toMatch(/Commands:\n +bare\n/);
});

test('when program has command with optional arg then appears in commandHelp', () => {
  const program = new commander.Command();
  program
    .command('bare [bare-arg]');
  const commandHelp = program.commandHelp();
  expect(commandHelp).toMatch(/Commands:\n +bare \[bare-arg\]\n/);
});
