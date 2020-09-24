const commander = require('../');

// Testing various help incantations.
//
// Note there are also specific help tests included in many of the feature tests,
// such as the alias, version, usage, name, helpOption, and commandHelp tests.

// Avoid doing many full format tests as will be broken by any layout changes!
test('when call helpInformation for program then help format is as expected (usage, options, commands)', () => {
  const program = new commander.Command();
  program
    .command('my-command <file>');
  const expectedHelpInformation =
`Usage: test [options] [command]

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
  program
    .command('simple-command')
    .description('custom-description');
  program._help = 'test';
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch(/simple-command +custom-description/);
});

test('when call .help then exit', () => {
  // Optional. Suppress normal output to keep test output clean.
  const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  const program = new commander.Command();
  program
    .exitOverride();
  expect(() => {
    program.help();
  }).toThrow('(outputHelp)');
  writeSpy.mockClear();
});

test('when specify --help then exit', () => {
  // Optional. Suppress normal output to keep test output clean.
  const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  const program = new commander.Command();
  program
    .exitOverride();
  expect(() => {
    program.parse(['node', 'test', '--help']);
  }).toThrow('(outputHelp)');
  writeSpy.mockClear();
});

test('when call help(cb) then display cb output and exit', () => {
  // Using spy to detect custom output
  const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  const helpReplacement = 'reformatted help';
  const program = new commander.Command();
  program
    .exitOverride();
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
  const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  const helpReplacement = 'reformatted help';
  const program = new commander.Command();
  program.outputHelp((helpInformation) => {
    return helpReplacement;
  });
  expect(writeSpy).toHaveBeenCalledWith(helpReplacement);
  writeSpy.mockClear();
});

// noHelp is now named hidden, not officially deprecated yet
test('when command sets noHelp then not displayed in helpInformation', () => {
  const program = new commander.Command();
  program
    .command('secret', 'secret description', { noHelp: true });
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('secret');
});

test('when command sets hidden then not displayed in helpInformation', () => {
  const program = new commander.Command();
  program
    .command('secret', 'secret description', { hidden: true });
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('secret');
});

test('when addCommand with hidden:true then not displayed in helpInformation', () => {
  const secretCmd = new commander.Command('secret');

  const program = new commander.Command();
  program
    .addCommand(secretCmd, { hidden: true });
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('secret');
});

test('when help short flag masked then not displayed in helpInformation', () => {
  const program = new commander.Command();
  program
    .option('-h, --host', 'select host');
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch(/\W-h\W.*display help/);
});

test('when both help flags masked then not displayed in helpInformation', () => {
  const program = new commander.Command();
  program
    .option('-h, --help', 'custom');
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('display help');
});

test('when no options then Options not includes in helpInformation', () => {
  const program = new commander.Command();
  // No custom options, no version option, no help option
  program
    .helpOption(false);
  const helpInformation = program.helpInformation();
  expect(helpInformation).not.toMatch('Options');
});

test('when arguments then included in helpInformation', () => {
  const program = new commander.Command();
  program
    .name('foo')
    .arguments('<file>');
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('Usage: foo [options] <file>');
});

test('when arguments described then included in helpInformation', () => {
  const program = new commander.Command();
  program
    .arguments('<file>')
    .helpOption(false)
    .description('description', { file: 'input source' });
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch(/Arguments:\n +file +input source/); // [sic], extra line
});
