const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('sortSubcommands', () => {
  test('when unsorted then commands in order added', () => {
    const program = new commander.Command();
    program
      .command('ccc', 'desc')
      .command('aaa', 'desc')
      .command('bbb', 'desc');
    const helper = program.createHelp();
    const visibleCommandNames = helper.visibleCommands(program).map(cmd => cmd.name());
    expect(visibleCommandNames).toEqual(['ccc', 'aaa', 'bbb', 'help']);
  });

  test('when sortSubcommands:true then commands sorted', () => {
    const program = new commander.Command();
    program
      .configureHelp({ sortSubcommands: true })
      .command('ccc', 'desc')
      .command('aaa', 'desc')
      .command('bbb', 'desc');
    const helper = program.createHelp();
    const visibleCommandNames = helper.visibleCommands(program).map(cmd => cmd.name());
    expect(visibleCommandNames).toEqual(['aaa', 'bbb', 'ccc', 'help']);
  });
});
