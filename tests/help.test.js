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
    expect(helper.optionTerm(option)).toEqual(flags);
  });

  test('when --short flags then returns flags', () => {
    const flags = '--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toEqual(flags);
  });

  test('when -s,--short flags then returns flags', () => {
    const flags = '-s,--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toEqual(flags);
  });

  test('when -s|--short flags then returns flags', () => {
    const flags = '-s|--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toEqual(flags);
  });
});

describe('largestCommandTermLength', () => {
  test('when no commands then returns zero', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.largestCommandTermLength(program, helper)).toEqual(0);
  });

  test('when command and no help then returns length of term', () => {
    const sub = new commander.Command('sub');
    const program = new commander.Command();
    program
      .addHelpCommand(false)
      .addCommand(sub);
    const helper = new commander.Help();
    expect(helper.largestCommandTermLength(program, helper)).toEqual(helper.commandTerm(sub).length);
  });

  test('when command with arg and no help then returns length of term', () => {
    const sub = new commander.Command('sub <file)');
    const program = new commander.Command();
    program
      .addHelpCommand(false)
      .addCommand(sub);
    const helper = new commander.Help();
    expect(helper.largestCommandTermLength(program, helper)).toEqual(helper.commandTerm(sub).length);
  });

  test('when multiple commands then returns longest length', () => {
    const longestCommandName = 'alphabet-soup <longer_than_help>';
    const program = new commander.Command();
    program
      .addHelpCommand(false)
      .command('before', 'desc')
      .command(longestCommandName, 'desc')
      .command('after', 'desc');
    const helper = new commander.Help();
    expect(helper.largestCommandTermLength(program, helper)).toEqual(longestCommandName.length);
  });

  test('when just help command then returns length of help term', () => {
    const program = new commander.Command();
    program
      .addHelpCommand(true);
    const helper = new commander.Help();
    expect(helper.largestCommandTermLength(program, helper)).toEqual('help [command]'.length);
  });
});

describe('largestOptionTermLength', () => {
  test('when no option then returns zero', () => {
    const program = new commander.Command();
    program.helpOption(false);
    const helper = new commander.Help();
    expect(helper.largestOptionTermLength(program, helper)).toEqual(0);
  });

  test('when implicit help option returns length of help flags', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.largestOptionTermLength(program, helper)).toEqual('-h, --help'.length);
  });

  test('when multiple option then returns longest length', () => {
    const longestOptionFlags = '-l, --longest <value>';
    const program = new commander.Command();
    program
      .option('--before', 'optional description of flags')
      .option(longestOptionFlags)
      .option('--after');
    const helper = new commander.Help();
    expect(helper.largestOptionTermLength(program, helper)).toEqual(longestOptionFlags.length);
  });
});

describe('largestArgTermLength', () => {
  test('when no arguments then returns zero', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.largestArgTermLength(program, helper)).toEqual(0);
  });

  test('when has argument description then returns argument length', () => {
    const program = new commander.Command();
    program.arguments('<wonder>');
    program.description('dummy', { wonder: 'wonder description' });
    const helper = new commander.Help();
    expect(helper.largestArgTermLength(program, helper)).toEqual('wonder'.length);
  });

  test('when has multiple argument descriptions then returns longest', () => {
    const program = new commander.Command();
    program.arguments('<alpha> <longest> <beta>');
    program.description('dummy', {
      alpha: 'x',
      longest: 'x',
      beta: 'x'
    });
    const helper = new commander.Help();
    expect(helper.largestArgTermLength(program, helper)).toEqual('longest'.length);
  });
});

describe('commandUsage', () => {
  test('when single program then "Usage: program [options]"', () => {
    const program = new commander.Command();
    program.name('program');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('Usage: program [options]');
  });

  test('when multi program then "Usage: program [options] [command]"', () => {
    const program = new commander.Command();
    program.name('program');
    program.command('sub');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('Usage: program [options] [command]');
  });

  test('when program has alias then usage includes alias', () => {
    const program = new commander.Command();
    program
      .name('program')
      .alias('alias');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('Usage: program|alias [options]');
  });

  test('when help for subcommand then usage includes hierarchy', () => {
    const program = new commander.Command();
    program
      .name('program');
    const sub = program.command('sub')
      .name('sub');
    const helper = new commander.Help();
    expect(helper.commandUsage(sub)).toEqual('Usage: program sub [options]');
  });

  test('when program has argument then usage includes argument', () => {
    const program = new commander.Command();
    program
      .name('program')
      .arguments('<file>');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('Usage: program [options] <file>');
  });
});

describe('commandDescription', () => {
  test('when program has no description then empty string', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.commandDescription(program)).toEqual('');
  });

  test('when program has description then return description', () => {
    const description = 'description';
    const program = new commander.Command();
    program.description(description);
    const helper = new commander.Help();
    expect(helper.commandDescription(program)).toEqual(description);
  });
});

describe('optionDescription', () => {
  test('when option has no description then empty string', () => {
    const option = new commander.Option('-a');
    const helper = new commander.Help();
    expect(helper.optionDescription(option)).toEqual('');
  });

  test('when option has description then return description', () => {
    const description = 'description';
    const option = new commander.Option('-a', description);
    const helper = new commander.Help();
    expect(helper.optionDescription(option)).toEqual(description);
  });

  test('when option has default value then return description and default value', () => {
    const description = 'description';
    const option = new commander.Option('-a', description).default('default');
    const helper = new commander.Help();
    expect(helper.optionDescription(option)).toEqual('description (default: "default")');
  });

  test('when option has default value description then return description and custom default description', () => {
    const description = 'description';
    const defaultValueDescription = 'custom';
    const option = new commander.Option('-a', description).default('default value', defaultValueDescription);
    const helper = new commander.Help();
    expect(helper.optionDescription(option)).toEqual(`description (default: ${defaultValueDescription})`);
  });

  test('when option has choices then return description and choices', () => {
    const description = 'description';
    const choices = ['one', 'two'];
    const option = new commander.Option('-a', description).choices(choices);
    const helper = new commander.Help();
    expect(helper.optionDescription(option)).toEqual('description (choices: "one", "two")');
  });
});
