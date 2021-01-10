const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('wrap', () => {
  test('when string fits into width then returns input', () => {
    const text = 'a '.repeat(24) + 'a';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 50, 3);
    expect(wrapped).toEqual(text);
  });

  test('when string shorter than indent then returns input', () => {
    const text = 'a';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 50, 3);
    expect(wrapped).toEqual(text);
  });

  test('when string exceeds width then wrap', () => {
    const text = 'a '.repeat(30) + 'a';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 50, 0);
    expect(wrapped).toEqual(`${'a '.repeat(24)}a
${'a '.repeat(5)}a`);
  });

  test('when string exceeds width then wrap and indent', () => {
    const text = 'a '.repeat(30) + 'a';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 50, 10);
    expect(wrapped).toEqual(`${'a '.repeat(24)}a
${' '.repeat(10)}${'a '.repeat(5)}a`);
  });

  test('when width < 40 then do not wrap', () => {
    const text = 'a '.repeat(30) + 'a';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 39, 0);
    expect(wrapped).toEqual(text);
  });

  test('when text has line breaks then respect and indent', () => {
    const text = 'term description\nanother line';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 78, 5);
    expect(wrapped).toEqual('term description\n     another line');
  });

  test('when text already formatted with line breaks and indent then do not touch', () => {
    const text = 'term a '.repeat(25) + '\n   ' + 'a '.repeat(25) + 'a';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 78, 5);
    expect(wrapped).toEqual(text);
  });
});

describe('wrapping by formatHelp', () => {
  // Test auto wrap and indent with some manual strings.
  // Fragile tests with complete help output.

  test('when long option description then wrap and indent', () => {
    const program = new commander.Command();
    program
      .configureHelp({ helpWidth: 80 })
      .option('-x --extra-long-option-switch', 'kjsahdkajshkahd kajhsd akhds kashd kajhs dkha dkh aksd ka dkha kdh kasd ka kahs dkh sdkh askdh aksd kashdk ahsd kahs dkha skdh');

    const expectedOutput =
`Usage:  [options]

Options:
  -x --extra-long-option-switch  kjsahdkajshkahd kajhsd akhds kashd kajhs dkha
                                 dkh aksd ka dkha kdh kasd ka kahs dkh sdkh
                                 askdh aksd kashdk ahsd kahs dkha skdh
  -h, --help                     display help for command
`;

    expect(program.helpInformation()).toBe(expectedOutput);
  });

  test('when long option description and default then wrap and indent', () => {
    const program = new commander.Command();
    program
      .configureHelp({ helpWidth: 80 })
      .option('-x --extra-long-option <value>', 'kjsahdkajshkahd kajhsd akhds', 'aaa bbb ccc ddd eee fff ggg');

    const expectedOutput =
`Usage:  [options]

Options:
  -x --extra-long-option <value>  kjsahdkajshkahd kajhsd akhds (default: "aaa
                                  bbb ccc ddd eee fff ggg")
  -h, --help                      display help for command
`;

    expect(program.helpInformation()).toBe(expectedOutput);
  });

  test('when long command description then wrap and indent', () => {
    const program = new commander.Command();
    program
      .configureHelp({ helpWidth: 80 })
      .option('-x --extra-long-option-switch', 'x')
      .command('alpha', 'Lorem mollit quis dolor ex do eu quis ad insa a commodo esse.');

    const expectedOutput =
`Usage:  [options] [command]

Options:
  -x --extra-long-option-switch  x
  -h, --help                     display help for command

Commands:
  alpha                          Lorem mollit quis dolor ex do eu quis ad insa
                                 a commodo esse.
  help [command]                 display help for command
`;

    expect(program.helpInformation()).toBe(expectedOutput);
  });

  test('when not enough room then help not wrapped', () => {
    // Not wrapping if less than 40 columns available for wrapping.
    const program = new commander.Command();
    const commandDescription = 'description text of very long command which should not be automatically be wrapped. Do fugiat eiusmod ipsum laboris excepteur pariatur sint ullamco tempor labore eu.';
    program
      .configureHelp({ helpWidth: 60 })
      .command('1234567801234567890x', commandDescription);

    const expectedOutput =
`Usage:  [options] [command]

Options:
  -h, --help            display help for command

Commands:
  1234567801234567890x  ${commandDescription}
  help [command]        display help for command
`;

    expect(program.helpInformation()).toBe(expectedOutput);
  });

  test('when option descripton preformatted then only add small indent', () => {
    // #396: leave custom format alone, apart from space-space indent
    const optionSpec = '-t, --time <HH:MM>';
    const program = new commander.Command();
    program
      .configureHelp({ helpWidth: 80 })
      .option(optionSpec, `select time

Time can also be specified using special values:
  "dawn" - From night to sunrise.
`);

    const expectedOutput =
`Usage:  [options]

Options:
  ${optionSpec}  select time
  
  Time can also be specified using special values:
    "dawn" - From night to sunrise.
  
  -h, --help          display help for command
`;

    expect(program.helpInformation()).toBe(expectedOutput);
  });
});
