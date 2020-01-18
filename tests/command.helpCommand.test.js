const commander = require('../');

describe('help command in displayed help', () => {
  test('when program has no subcommands then no automatic help command', () => {
    const program = new commander.Command();
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toMatch(/help \[command\]/);
  });

  test('when program has no subcommands and add help command then has help command', () => {
    const program = new commander.Command();
    program.addHelpCommand(true);
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch(/help \[command\]/);
  });

  test('when program has subcommands then has automatic help command', () => {
    const program = new commander.Command();
    program.command('foo');
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch(/help \[command\]/);
  });

  test('when program has subcommands and suppress help command then no help command', () => {
    const program = new commander.Command();
    program.addHelpCommand(false);
    program.command('foo');
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toMatch(/help \[command\]/);
  });

  test('when add custom help command then custom help command', () => {
    const program = new commander.Command();
    program.addHelpCommand('help command', 'help description');
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch(/help command +help description/);
  });
});
