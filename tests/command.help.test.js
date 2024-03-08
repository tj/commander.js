const commander = require('../');

// Testing various help incantations.
//
// Note there are also specific help tests included in many of the feature tests,
// such as the alias, version, usage, name, helpOption, and commandHelp tests.

// Avoid doing many full format tests as will be broken by any layout changes!
test('when call helpInformation for program then help format is as expected (usage, options, commands)', () => {
  const program = new commander.Command();
  program.command('my-command <file>');
  const expectedHelpInformation = `Usage: test [options] [command]

Options:
  -h, --help         display help for command

Commands:
  my-command <file>
  help [command]     display help for command
`;

  program.name('test');
  const helpInformation = program.helpInformation();
  expect(helpInformation).toBe(expectedHelpInformation);
});

test('when use .description for command then help includes description', () => {
  const program = new commander.Command();
  program.command('simple-command').description('custom-description');
  program._help = 'test';
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch(/simple-command +custom-description/);
});

test('when call .help then exit', () => {
  // Optional. Suppress normal output to keep test output clean.
  const writeSpy = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation(() => {});
  const program = new commander.Command();
  program.exitOverride();
  expect(() => {
    program.help();
  }).toThrow('(outputHelp)');
  writeSpy.mockClear();
});

test('when specify --help then exit', () => {
  // Optional. Suppress normal output to keep test output clean.
  const writeSpy = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation(() => {});
  const program = new commander.Command();
  program.exitOverride();
  expect(() => {
    program.parse(['node', 'test', '--help']);
  }).toThrow('(outputHelp)');
  writeSpy.mockClear();
});

test('when call help(cb) then display cb output and exit', () => {
  // Using spy to detect custom output
  const writeSpy = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation(() => {});
  const helpReplacement = 'reformatted help';
  const program = new commander.Command();
  program.exitOverride();
  expect(() => {
    program.help((helpInformation) => {
      return helpReplacement;
    });
  }).toThrow('(outputHelp)');
  expect(writeSpy).toHaveBeenCalledWith(helpReplacement);
  writeSpy.mockClear();
});

test('when call outputHelp(cb) then display cb output', () => {
  // Using spy to detect custom output
  const writeSpy = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation(() => {});
  const helpReplacement = 'reformatted help';
  const program = new commander.Command();
  program.outputHelp((helpInformation) => {
    return helpReplacement;
  });
  expect(writeSpy).toHaveBeenCalledWith(helpReplacement);
  writeSpy.mockClear();
});

test('when call deprecated outputHelp(cb) with wrong callback return type then throw', () => {
  const program = new commander.Command();
  expect(() => {
    program.outputHelp((helpInformation) => 3);
  }).toThrow();
});

test('when command sets deprecated noHelp then not displayed in helpInformation', () => {
  const program = new commander.Command();
  program.command('secret', 'secret description', { noHelp: true });
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('secret');
});

test('when command sets hidden then not displayed in helpInformation', () => {
  const program = new commander.Command();
  program.command('secret', 'secret description', { hidden: true });
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('secret');
});

test('when addCommand with hidden:true then not displayed in helpInformation', () => {
  const secretCmd = new commander.Command('secret');

  const program = new commander.Command();
  program.addCommand(secretCmd, { hidden: true });
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('secret');
});

test('when help short flag masked then not displayed in helpInformation', () => {
  const program = new commander.Command();
  program.option('-h, --host', 'select host');
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch(/\W-h\W.*display help/);
});

test('when both help flags masked then not displayed in helpInformation', () => {
  const program = new commander.Command();
  program.option('-h, --help', 'custom');
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('display help');
});

test('when call .help then output on stdout', () => {
  const writeSpy = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation(() => {});
  const program = new commander.Command();
  program.exitOverride();
  expect(() => {
    program.help();
  }).toThrow('(outputHelp)');
  expect(writeSpy).toHaveBeenCalledWith(program.helpInformation());
  writeSpy.mockClear();
});

test('when call .help with { error: true } then output on stderr', () => {
  const writeSpy = jest
    .spyOn(process.stderr, 'write')
    .mockImplementation(() => {});
  const program = new commander.Command();
  program.exitOverride();
  expect(() => {
    program.help({ error: true });
  }).toThrow('(outputHelp)');
  expect(writeSpy).toHaveBeenCalledWith(program.helpInformation());
  writeSpy.mockClear();
});

test('when no options then Options not included in helpInformation', () => {
  const program = new commander.Command();
  // No custom options, no version option, no help option
  program.helpOption(false);
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('Options');
});

test('when negated option then option included in helpInformation', () => {
  const program = new commander.Command();
  program.option('-C, --no-colour', 'colourless');
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('--no-colour');
  expect(helpInformation).toMatch('colourless');
});

test('when option.hideHelp() then option not included in helpInformation', () => {
  const program = new commander.Command();
  program.addOption(
    new commander.Option('-s,--secret', 'secret option').hideHelp(),
  );
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('secret');
});

test('when option.hideHelp(true) then option not included in helpInformation', () => {
  const program = new commander.Command();
  program.addOption(
    new commander.Option('-s,--secret', 'secret option').hideHelp(true),
  );
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('secret');
});

test('when option.hideHelp(false) then option included in helpInformation', () => {
  const program = new commander.Command();
  program.addOption(
    new commander.Option('-s,--secret', 'secret option').hideHelp(false),
  );
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('secret');
});

test('when option has default value then default included in helpInformation', () => {
  const program = new commander.Command();
  program.option('-p, --port <portNumber>', 'port number', 80);
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('(default: 80)');
});

test('when option has default value description then default description included in helpInformation', () => {
  const program = new commander.Command();
  program.addOption(
    new commander.Option('-a, --address <dotted>', 'ip address').default(
      '127.0.0.1',
      'home',
    ),
  );
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('(default: home)');
});

test('when option has choices then choices included in helpInformation', () => {
  const program = new commander.Command();
  program.addOption(
    new commander.Option('-c, --colour <colour>').choices(['red', 'blue']),
  );
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('(choices: "red", "blue")');
});

test('when option has choices and default then both included in helpInformation', () => {
  const program = new commander.Command();
  program.addOption(
    new commander.Option('-c, --colour <colour>')
      .choices(['red', 'blue'])
      .default('red'),
  );
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('(choices: "red", "blue", default: "red")');
});

test('when argument then included in helpInformation', () => {
  const program = new commander.Command();
  program.name('foo').argument('<file>');
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('Usage: foo [options] <file>');
});

test('when argument described then included in helpInformation', () => {
  const program = new commander.Command();
  program.argument('<file>', 'input source').helpOption(false);
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch(/Arguments:\n +file +input source/);
});

test('when argument described with default then included in helpInformation', () => {
  const program = new commander.Command();
  program.argument('[file]', 'input source', 'test.txt').helpOption(false);
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch(
    /Arguments:\n +file +input source \(default: "test.txt"\)/,
  );
});

test('when arguments described in deprecated way then included in helpInformation', () => {
  const program = new commander.Command();
  program
    .arguments('<file>')
    .helpOption(false)
    .description('description', { file: 'input source' });
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch(/Arguments:\n +file +input source/);
});

test('when arguments described in deprecated way and empty description then arguments still included in helpInformation', () => {
  const program = new commander.Command();
  program
    .arguments('<file>')
    .helpOption(false)
    .description('', { file: 'input source' });
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch(/Arguments:\n +file +input source/);
});

test('when argument has choices then choices included in helpInformation', () => {
  const program = new commander.Command();
  program.addArgument(
    new commander.Argument('<colour>', 'preferred colour').choices([
      'red',
      'blue',
    ]),
  );
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('(choices: "red", "blue")');
});

test('when argument has choices and default then both included in helpInformation', () => {
  const program = new commander.Command();
  program.addArgument(
    new commander.Argument('<colour>', 'preferred colour')
      .choices(['red', 'blue'])
      .default('red'),
  );
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('(choices: "red", "blue", default: "red")');
});
