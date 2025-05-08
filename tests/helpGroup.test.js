const { Command, Option } = require('../');

// Similar tests for Option.helpGroup() and Command.helpGroup(),
// and for Command.optionsGroup() and Command.commandsGroup().

describe('Option.helpGroup', () => {
  test('when add one option with helpGroup then help contains group', () => {
    const program = new Command();
    program.addOption(new Option('--alpha').helpGroup('Greek:'));
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *--alpha/);
  });

  test('when add two options with helpGroup then help contains group', () => {
    const program = new Command();
    program.addOption(new Option('--alpha').helpGroup('Greek:'));
    program.addOption(new Option('--beta').helpGroup('Greek:'));
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *--alpha\n *--beta/);
  });
});

describe('Command.helpGroup', () => {
  test('when add one command with helpGroup then help contains group', () => {
    const program = new Command();
    program.command('alpha').helpGroup('Greek:');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *alpha/);
  });

  test('when add two commands with helpGroup then help contains group', () => {
    const program = new Command();
    program.command('alpha').helpGroup('Greek:');
    program.command('beta').helpGroup('Greek:');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *alpha\n *beta/);
  });
});

describe('.optionsGroup', () => {
  test('when add one option then help contains group', () => {
    const program = new Command();
    program.optionsGroup('Greek:');
    program.option('--alpha');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *--alpha/);
  });

  test('when add two options then help contains group with two options', () => {
    const program = new Command();
    program.optionsGroup('Greek:');
    program.option('--alpha');
    program.option('--beta');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *--alpha\n *--beta/);
  });

  test('when add options with different groups then help contains two groups', () => {
    const program = new Command();
    program.optionsGroup('Greek:');
    program.option('--alpha');
    program.optionsGroup('Latin:');
    program.option('--unus');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *--alpha/);
    expect(helpInfo).toMatch(/Latin:\n *--unus/);
  });

  test('when implicit help option then help option not affected', () => {
    const program = new Command();
    program.optionsGroup('Greek:');
    program.option('--alpha');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Options:\n *-h, --help/);
  });

  test('when option with helpGroup then helpGroup wins', () => {
    const program = new Command();
    program.optionsGroup('Greek:');
    program.addOption(new Option('--unus').helpGroup('Latin:'));
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Latin:\n *--unus/);
  });

  test('when add no options with heading then heading does not appear', () => {
    const program = new Command();
    program.optionsGroup('Greek:');
    const helpInfo = program.helpInformation();
    expect(helpInfo).not.toMatch(/Greek/);
  });

  test('when add no visible options with heading then heading does not appear', () => {
    const program = new Command();
    program.optionsGroup('Greek:');
    program.addOption(new Option('--alpha').hideHelp());
    const helpInfo = program.helpInformation();
    expect(helpInfo).not.toMatch(/Greek/);
  });

  test('when .helpOption(flags) then help option in group', () => {
    const program = new Command();
    program.optionsGroup('Greek:');
    program.helpOption('--assist');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *--assist/);
  });

  test('when .helpOption(true) then help option in group', () => {
    const program = new Command();
    program.optionsGroup('Greek:');
    program.helpOption(true);
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *-h, --help/);
  });

  test('when .version(str) then version option in group', () => {
    const program = new Command();
    program.optionsGroup('Greek:');
    program.version('1.2.3');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *-V, --version/);
  });

  test('when set sortOptions then options are sorted within groups', () => {
    const program = new Command();
    program.configureHelp({ sortOptions: true });
    program.optionsGroup('Latin:');
    program.option('--unus');
    program.option('--duo');
    program.optionsGroup('Greek:');
    program.option('--beta');
    program.option('--alpha');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Latin:\n *--duo\n *--unus/);
    expect(helpInfo).toMatch(/Greek:\n *--alpha\n *--beta/);
  });

  test('when set sortOptions then groups are in order added not sorted', () => {
    const program = new Command();
    program.configureHelp({ sortOptions: true });
    program.addOption(new Option('--bbb').helpGroup('BBB:'));
    program.addOption(new Option('--ccc').helpGroup('CCC:'));
    program.addOption(new Option('--aaa').helpGroup('AAA:'));
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(
      /BBB:\n *--bbb.*\n\nCCC:\n *--ccc.*\n\nAAA:\n *--aaa/,
    );
  });
});

describe('.commandsGroup', () => {
  test('when add one command then help contains group', () => {
    const program = new Command();
    program.commandsGroup('Greek:');
    program.command('alpha');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *alpha/);
  });

  test('when add two commands then help contains group with two commands', () => {
    const program = new Command();
    program.commandsGroup('Greek:');
    program.command('alpha');
    program.command('beta');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *alpha\n *beta/);
  });

  test('when add commands with different groups then help contains two groups', () => {
    const program = new Command();
    program.commandsGroup('Greek:');
    program.command('alpha');
    program.commandsGroup('Latin:');
    program.command('unus');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *alpha/);
    expect(helpInfo).toMatch(/Latin:\n *unus/);
  });

  test('when implicit help command then help command not affected', () => {
    const program = new Command();
    program.commandsGroup('Greek:');
    program.command('alpha');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Commands:\n *help/);
  });

  test('when command with custom helpGroup then helpGroup wins', () => {
    const program = new Command();
    program.commandsGroup('Greek:');
    program.command('unus').helpGroup('Latin:');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Latin:\n *unus/);
  });

  test('when add no commands with heading then heading does not appear', () => {
    const program = new Command();
    program.commandsGroup('Greek:');
    const helpInfo = program.helpInformation();
    expect(helpInfo).not.toMatch(/Greek/);
  });

  test('when add no visible command with heading then heading does not appear', () => {
    const program = new Command();
    program.commandsGroup('Greek:');
    program.command('alpha', { hidden: true });
    const helpInfo = program.helpInformation();
    expect(helpInfo).not.toMatch(/Greek/);
  });

  test('when .helpCommand(name) then help command in group', () => {
    const program = new Command();
    program.command('foo');
    program.commandsGroup('Greek:');
    program.helpCommand('assist');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *assist/);
  });

  test('when .helpCommand(true) then help command in group', () => {
    const program = new Command();
    program.command('foo');
    program.commandsGroup('Greek:');
    program.helpCommand(true);
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Greek:\n *help/);
  });

  test('when set sortCommands then commands are sorted within groups', () => {
    const program = new Command();
    program.configureHelp({ sortSubcommands: true });
    program.commandsGroup('Latin:');
    program.command('unus');
    program.command('duo');
    program.commandsGroup('Greek:');
    program.command('beta');
    program.command('alpha');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/Latin:\n *duo\n *unus/);
    expect(helpInfo).toMatch(/Greek:\n *alpha\n *beta/);
  });

  test('when set sortOptions then groups are in order added not sorted', () => {
    const program = new Command();
    program.configureHelp({ sortSubcommands: true });
    program.command('bbb').helpGroup('BBB:');
    program.command('ccc').helpGroup('CCC:');
    program.command('aaa').helpGroup('AAA:');
    const helpInfo = program.helpInformation();
    expect(helpInfo).toMatch(/BBB:\n *bbb.*\n\nCCC:\n *ccc.*\n\nAAA:\n *aaa/);
  });
});
