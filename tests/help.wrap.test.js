const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

// ECMAScript 12.2 White Space
const whitespaces = '\t\v\f\ufeff \u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000';

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

  test('when string and indent have equal length then returns input', () => {
    const text = 'aaa';
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

  test('when word exceeds width then wrap word overflow', () => {
    const text = 'a'.repeat(60);
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 50, 0);
    expect(wrapped).toEqual(`${'a'.repeat(49)}
${'a'.repeat(11)}`);
  });

  test('when word exceeds width then wrap word overflow and indent', () => {
    const text = 'a'.repeat(60);
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 50, 3);
    expect(wrapped).toEqual(`${'a'.repeat(49)}
   ${'a'.repeat(11)}`);
  });

  test('when negative shift and first word exceeds column width then place in overflow', () => {
    const text = ' '.repeat(5) + 'a'.repeat(49);
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 50, 5, 40, -5);
    expect(wrapped).toEqual(`
${'a'.repeat(49)}`);
  });

  test('when negative shift and first word exceeds overflow width then place in overflow', () => {
    const text = ' '.repeat(5) + 'a'.repeat(60);
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 50, 5, 40, -5);
    expect(wrapped).toEqual(`
${'a'.repeat(49)}
${'a'.repeat(11)}`);
  });

  test('when width < 40 then wrap but do not indent', () => {
    const text = 'a '.repeat(30) + 'a';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 39, 10);
    expect(wrapped).toEqual(`${'a '.repeat(18)}a
${'a '.repeat(11)}a`);
  });

  test('when text has line break then respect and indent', () => {
    const text = 'term description\nanother line';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 78, 5);
    expect(wrapped).toEqual('term description\n     another line');
  });

  test('when text has consecutive line breaks then respect and indent', () => {
    const text = 'term description\n\nanother line';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 78, 5);
    expect(wrapped).toEqual('term description\n\n     another line');
  });

  test('when text has Windows line break then respect and indent', () => {
    const text = 'term description\r\nanother line';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 78, 5);
    expect(wrapped).toEqual('term description\n     another line');
  });

  test('when text has Windows consecutive line breaks then respect and indent', () => {
    const text = 'term description\r\n\r\nanother line';
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 78, 5);
    expect(wrapped).toEqual('term description\n\n     another line');
  });

  test('when more whitespaces after line than available width then collapse all', () => {
    const text = `abcd${whitespaces}\ne`;
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 5, 0);
    expect(wrapped).toEqual('abcd\ne');
  });

  test('when line of whitespaces then do not indent', () => {
    const text = whitespaces;
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 50, 0, 40, 3, 3, 3);
    expect(wrapped).toEqual('');
  });

  test('when not pre-formatted then trim ends of output lines', () => {
    const text = '\na\n' + // leadingStr (first column)
      '\n\na ' + // text to wrap and indent (new, second column) before overflow
      '\n\na '; // overflowing lines of the text (column overflow)
    const helper = new commander.Help();
    const wrapped = helper.wrap(text, 50, 3, 40, -3, 3, 3);
    expect(wrapped).toEqual(`
   a
       a

    a`);
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

  test('when long subcommand description then wrap and indent', () => {
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

  test('when not enough room then help wrapped but not indented', () => {
    // Here, a limiting case is considered. Removal of one character from the command name will make 40 columns available for wrapping, which is the default minimum value for overflowing text width.
    const program = new commander.Command();
    const commandDescription = 'very long command description text which should be wrapped but not indented. Do fugiat eiusmod ipsum laboris excepteur pariatur sint ullamco tempor labore eu.';
    program
      .configureHelp({ helpWidth: 60 })
      .command('0123456789abcdef+', commandDescription);

    const expectedOutput =
`Usage:  [options] [command]

Options:
  -h, --help         display help for command

Commands:
  0123456789abcdef+  very long command description text
which should be wrapped but not indented. Do fugiat eiusmod
ipsum laboris excepteur pariatur sint ullamco tempor labore
eu.
  help [command]     display help for command
`;

    expect(program.helpInformation()).toBe(expectedOutput);
  });

  test('when option description pre-formatted then only add small indent', () => {
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

  test('when command description long then wrapped', () => {
    const program = new commander.Command();
    program
      .configureHelp({ helpWidth: 80 })
      .description(`Do fugiat eiusmod ipsum laboris excepteur pariatur sint ullamco tempor labore eu Do fugiat eiusmod ipsum laboris excepteur pariatur sint ullamco tempor labore eu
After line break Do fugiat eiusmod ipsum laboris excepteur pariatur sint ullamco tempor labore eu Do fugiat eiusmod ipsum laboris excepteur pariatur sint ullamco tempor labore eu`);
    const expectedOutput = `Usage:  [options]

Do fugiat eiusmod ipsum laboris excepteur pariatur sint ullamco tempor labore
eu Do fugiat eiusmod ipsum laboris excepteur pariatur sint ullamco tempor
labore eu
After line break Do fugiat eiusmod ipsum laboris excepteur pariatur sint
ullamco tempor labore eu Do fugiat eiusmod ipsum laboris excepteur pariatur
sint ullamco tempor labore eu

Options:
  -h, --help  display help for command
`;
    expect(program.helpInformation()).toBe(expectedOutput);
  });
});
