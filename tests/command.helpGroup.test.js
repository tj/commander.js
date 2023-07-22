const commander = require('../');

// Just testing the observable Command behaviour here, actual Help behaviour tested elsewhere.

test('when set helpGroup on Command then can get helpGroup', () => {
  const cmd = new commander.Command();
  const group = 'Example:';
  cmd.helpGroup(group);
  expect(cmd.helpGroup()).toEqual(group);
});

test('when use opt.helpGroup with external command then sets helpGroup on new command', () => {
  const program = new commander.Command();
  const group = 'Example:';
  program.command('external', 'external description', { helpGroup: group });
  expect(program.commands[program.commands.length - 1].helpGroup()).toEqual(group);
});
