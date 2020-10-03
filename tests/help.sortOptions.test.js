const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('sortOptions', () => {
  test('when unsorted then options in order added', () => {
    const program = new commander.Command();
    program
      .option('--zzz', 'desc')
      .option('--aaa', 'desc')
      .option('--bbb', 'desc');
    const helper = program.createHelp();
    const visibleOptionNames = helper.visibleOptions(program).map(option => option.name());
    expect(visibleOptionNames).toEqual(['zzz', 'aaa', 'bbb', 'help']);
  });

  test('when sortOptions:true then options sorted', () => {
    const program = new commander.Command();
    program
      .configureHelp({ sortOptions: true })
      .option('--zzz', 'desc')
      .option('--aaa', 'desc')
      .option('--bbb', 'desc');
    const helper = program.createHelp();
    const visibleCommandNames = helper.visibleOptions(program).map(cmd => cmd.name());
    expect(visibleCommandNames).toEqual(['aaa', 'bbb', 'help', 'zzz']);
  });

  test('when sortOptions:true then options sorted on name not flags', () => {
    const program = new commander.Command();
    program
      .configureHelp({ sortOptions: true })
      .option('-m,--zzz', 'desc')
      .option('-n,--aaa', 'desc')
      .option('-o,--bbb', 'desc');
    const helper = program.createHelp();
    const visibleCommandNames = helper.visibleOptions(program).map(cmd => cmd.name());
    expect(visibleCommandNames).toEqual(['aaa', 'bbb', 'help', 'zzz']);
  });
});
