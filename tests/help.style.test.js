const { Command } = require('../');

function red(str) {
  // Use plain characters so not stripped in Jest failure messages. (Means displayWidth is bogus though.)
  return `RED ${str} DER`;
}
function stripRed(str) {
  return str.replace(/RED /g, '').replace(/ DER/g, '');
}
function displayWidth(str) {
  // Not really zero width for the "color", but pretend so spacing matches no-color output.
  return stripRed(str).length;
}

describe('override style methods and check help information', () => {
  function makeProgram() {
    const program = new Command('program')
      .description('program description')
      .argument('<file>', 'arg description')
      .configureOutput({
        getOutHasColors: () => true, // avoid interactions with testing environment
      });
    program
      .command('subcommand')
      .description('sub description')
      .option('--suboption')
      .argument('[subarg]');

    return program;
  }

  const plainHelpInformation = makeProgram().helpInformation();

  test('styleTitle', () => {
    const program = makeProgram();
    program.configureHelp({ styleTitle: (str) => red(str) }, displayWidth);
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

  test('styleOptionDescription', () => {
    const program = makeProgram();
    program.configureHelp({
      styleOptionDescription: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation.replace(
        /(-h, --help *)(display help for command)/,
        (match, p1, p2) => p1 + red(p2),
      ),
    );
  });

  test('styleSubcommandDescription', () => {
    const program = makeProgram();
    program.configureHelp({
      styleSubcommandDescription: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation
        .replace(
          /(\[subarg\] *)(sub description)/,
          (match, p1, p2) => p1 + red(p2),
        )
        .replace(
          /(help \[command\] *)(display help for command)/,
          (match, p1, p2) => p1 + red(p2),
        ),
    );
  });

  test('styleArgumentDescription', () => {
    const program = makeProgram();
    program.configureHelp({
      styleArgumentDescription: (str) => red(str),
      displayWidth,
    });
    const helpText = program.helpInformation();
    expect(helpText).toEqual(
      plainHelpInformation.replace('arg description', red('arg description')),
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
        .replace(
          'subcommand [options] [subarg]',
          red('subcommand [options] [subarg]'),
        ),
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
        .replace(/\[options\]/g, red('[options]'))
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
        .replace('[subarg]', red('[subarg]'))
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

describe('check styles with configureOutput overrides for color', () => {
  function makeProgram(hasColors) {
    const program = new Command('program');
    program.myHelpText = [];
    program
      .description('program description')
      .argument('<file>', 'arg description')
      .configureOutput({
        getOutHasColors: () => hasColors,
        stripColor: (str) => stripRed(str),
        writeOut: (str) => {
          program.myHelpText.push(str);
        },
      });
    program.configureHelp({
      styleCommandText: (str) => red(str),
      displayWidth,
    });

    return program;
  }

  test('when getOutHasColors returns true then help has color', () => {
    const program = makeProgram(true);
    program.outputHelp();
    const helpText = program.myHelpText.join('');
    expect(helpText).toMatch(red('program'));
  });

  test('when getOutHasColors returns false then help does not have color', () => {
    const program = makeProgram(false);
    program.outputHelp();
    const helpText = program.myHelpText.join('');
    expect(helpText).not.toMatch(red('program'));
  });

  test('when getOutHasColors returns false then style still called', () => {
    const program = makeProgram(true);
    // Overwrite styleCommandText so we can track whether called.
    let styleCalled = false;
    const config = program.configureHelp();
    config.styleCommandText = (str) => {
      styleCalled = true;
      return red(str);
    };
    program.configureHelp(config);
    program.outputHelp();
    expect(styleCalled).toBe(true);
  });
});
