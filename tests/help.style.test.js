const { Command } = require('../');

function red(str) {
  // Dummy colouring to keep test outputs plain text for easier visual compares.
  return `RED ${str} DER`;
}
function displayWidth(str) {
  return str.replace(/RED /g, '').replace(/ DER/g, '').length;
}

describe('Help.styleFoo', () => {
  function makeProgram() {
    const program = new Command('program')
      .description('program description')
      .argument('<file>', 'arg description')
      .configureOutput({
        getOutHasColors: () => true, // avoid interactions with testing environment
      });
    program.command('subcommand', 'sub description');

    return program;
  }

  const plainHelpInformation = makeProgram().helpInformation();

  test('styleTitle', () => {
    const program = makeProgram();
    program.configureHelp({ styleTitle: (str) => red(str), displayWidth });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation
        .replace('Usage:', red('Usage:'))
        .replace('Arguments:', red('Arguments:'))
        .replace('Options:', red('Options:'))
        .replace('Commands:', red('Commands:')),
    );
  });

  test('styleUsage', () => {
    const program = makeProgram();
    program.configureHelp({ styleUsage: (str) => red(str), displayWidth });
    const helpText = program.helpInformation();
    const usageString = program.createHelp().commandUsage(program);
    expect(helpText).toEqual(
      plainHelpInformation.replace(usageString, red(usageString)),
    );
  });

  test('styleItemDescription', () => {
    const program = makeProgram();
    program.configureHelp({
      styleItemDescription: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation
        .replace('arg description', red('arg description'))
        .replace('sub description', red('sub description'))
        .replace(/display help for command/g, red('display help for command')),
    );
  });

  test('styleCommandDescription', () => {
    const program = makeProgram();
    program.configureHelp({
      styleCommandDescription: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation.replace(
        'program description',
        red('program description'),
      ),
    );
  });

  test('styleDescriptionText', () => {
    const program = makeProgram();
    program.configureHelp({
      styleDescriptionText: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation
        .replace('program description', red('program description'))
        .replace('arg description', red('arg description'))
        .replace('sub description', red('sub description'))
        .replace(/display help for command/g, red('display help for command')),
    );
  });

  test('styleOptionTerm', () => {
    const program = makeProgram();
    program.configureHelp({ styleOptionTerm: (str) => red(str), displayWidth });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation.replace('-h, --help', red('-h, --help')),
    );
  });

  test('styleSubcommandTerm', () => {
    const program = makeProgram();
    program.configureHelp({
      styleSubcommandTerm: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation
        .replace('help [command]', red('help [command]'))
        .replace('subcommand', red('subcommand')),
    );
  });

  test('styleArgumentTerm', () => {
    const program = makeProgram();
    program.configureHelp({
      styleArgumentTerm: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation.replace(' file ', ` ${red('file')} `),
    );
  });

  test('styleOptionText', () => {
    const program = makeProgram();
    program.configureHelp({
      styleOptionText: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation
        .replace('[options]', red('[options]'))
        .replace('-h, --help', red('-h, --help')),
    );
  });

  test('styleArgumentText', () => {
    const program = makeProgram();
    program.configureHelp({
      styleArgumentText: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation
        .replace('<file>', red('<file>'))
        .replace(' file ', ` ${red('file')} `)
        .replace('help [command]', `help ${red('[command]')}`),
    );
  });

  test('styleSubcommandText', () => {
    const program = makeProgram();
    program.configureHelp({
      styleSubcommandText: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation
        .replace('[command] <file>', `${red('[command]')} <file>`)
        .replace('help [command]', `${red('help')} [command]`)
        .replace('subcommand', red('subcommand')),
    );
  });

  test('styleCommandText', () => {
    const program = makeProgram();
    program.configureHelp({
      styleCommandText: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation.replace('program', red('program')),
    );
  });
});

describe('ENV overrides for Help styles', () => {});
