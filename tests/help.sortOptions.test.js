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

  test('when sortOptions:true then options sorted alphabetically', () => {
    const program = new commander.Command();
    program
      .configureHelp({ sortOptions: true })
      .option('--zzz', 'desc')
      .option('--aaa', 'desc')
      .option('--bbb', 'desc');
    const helper = program.createHelp();
    const visibleOptionNames = helper.visibleOptions(program).map(cmd => cmd.name());
    expect(visibleOptionNames).toEqual(['aaa', 'bbb', 'help', 'zzz']);
  });

  test('when both short and long flags then sort on long flag (name)', () => {
    const program = new commander.Command();
    program
      .configureHelp({ sortOptions: true })
      .option('-m,--zzz', 'desc')
      .option('-n,--aaa', 'desc')
      .option('-o,--bbb', 'desc');
    const helper = program.createHelp();
    const visibleOptionNames = helper.visibleOptions(program).map(cmd => cmd.name());
    expect(visibleOptionNames).toEqual(['aaa', 'bbb', 'help', 'zzz']);
  });

  test('when lone short and long flags then sort on flag (name)', () => {
    const program = new commander.Command();
    program
      .configureHelp({ sortOptions: true })
      .option('--zzz', 'desc')
      .option('--aaa', 'desc')
      .option('-b', 'desc');
    const helper = program.createHelp();
    const visibleOptionNames = helper.visibleOptions(program).map(cmd => cmd.name());
    expect(visibleOptionNames).toEqual(['aaa', 'b', 'help', 'zzz']);
  });

  test('when negated option then sort negated option separately', () => {
    const program = new commander.Command();
    program
      .configureHelp({ sortOptions: true })
      .option('--bbb', 'desc')
      .option('--ccc', 'desc')
      .option('--no-bbb', 'desc')
      .option('--aaa', 'desc');
    const helper = program.createHelp();
    const visibleOptionNames = helper.visibleOptions(program).map(cmd => cmd.name());
    expect(visibleOptionNames).toEqual(['aaa', 'bbb', 'ccc', 'help', 'no-bbb']);
  });
});
