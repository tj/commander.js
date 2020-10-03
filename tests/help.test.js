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
      .command('invisible executable', 'desc', { hidden: true });
    program
      .command('invisible action', { hidden: true });
    const helper = new commander.Help();
    const visibleCommandNames = helper.visibleCommands(program).map(cmd => cmd.name());
    expect(visibleCommandNames).toEqual(['visible', 'help']);
  });
});

describe('visibleOptions', () => {
  test('when no options then just help visible', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    const visibleOptionNames = helper.visibleOptions(program).map(option => option.name());
    expect(visibleOptionNames).toEqual(['help']);
  });

  test('when no options and no help option then empty array', () => {
    const program = new commander.Command();
    program.helpOption(false);
    const helper = new commander.Help();
    expect(helper.visibleOptions(program)).toEqual([]);
  });

  test('when add option then visible (with help)', () => {
    const program = new commander.Command();
    program.option('-v,--visible');
    const helper = new commander.Help();
    const visibleOptionNames = helper.visibleOptions(program).map(option => option.name());
    expect(visibleOptionNames).toEqual(['visible', 'help']);
  });

  test('when option hidden then not visible', () => {
    const program = new commander.Command();
    program
      .option('-v,--visible')
      .addOption(new commander.Option('--invisible').hideHelp());
    const helper = new commander.Help();
    const visibleOptionNames = helper.visibleOptions(program).map(option => option.name());
    expect(visibleOptionNames).toEqual(['visible', 'help']);
  });
});

describe('visibleArguments', () => {
  test('when no arguments then empty array', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.visibleArguments(program)).toEqual([]);
  });

  test('when argument but no argument description then empty array', () => {
    const program = new commander.Command();
    program.arguments('<file>');
    const helper = new commander.Help();
    expect(helper.visibleArguments(program)).toEqual([]);
  });

  test('when argument and argument description then returned', () => {
    const program = new commander.Command();
    program.arguments('<file>');
    program.description('dummy', { file: 'file description' });
    const helper = new commander.Help();
    expect(helper.visibleArguments(program)).toEqual([{ term: 'file', description: 'file description' }]);
  });
});

describe.skip('commandTerm', () => {
  // Not happy with legacy behaviour which ignores possibility of hidden options or custom usage string or subcommands.
});

describe('optionTerm', () => {
  test('when -s flags then returns flags', () => {
    const flags = '-s';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toBe(flags);
  });

  test('when --short flags then returns flags', () => {
    const flags = '--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toBe(flags);
  });

  test('when -s,--short flags then returns flags', () => {
    const flags = '-s,--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toBe(flags);
  });

  test('when -s|--short flags then returns flags', () => {
    const flags = '-s|--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toBe(flags);
  });
});
