const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('visibleCommands', () => {
  test('when no subcommands then empty array', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.visibleCommands(program)).toEqual([]);
  });

  test('when add command then visible (with help)', () => {
    const program = new commander.Command();
    program
      .command('sub');
    const helper = new commander.Help();
    const visibleCommandNames = helper.visibleCommands(program).map(cmd => cmd.name());
    expect(visibleCommandNames).toEqual(['sub', 'help']);
  });

  test('when commands hidden then not visible', () => {
    const program = new commander.Command();
    program
      .command('visible', 'desc')
      .command('invisible-executable', 'desc', { hidden: true });
    program
      .command('invisible-action', { hidden: true });
    const helper = new commander.Help();
    const visibleCommandNames = helper.visibleCommands(program).map(cmd => cmd.name());
    expect(visibleCommandNames).toEqual(['visible', 'help']);
  });
});
