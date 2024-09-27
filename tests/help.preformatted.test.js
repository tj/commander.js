const { Help, Command } = require('../');

describe('preformatted', () => {
  test('when single line then false', () => {
    const helper = new Help();
    expect(helper.preformatted('a b c')).toBe(false);
  });

  test('when single line with leading whitespace then false', () => {
    const helper = new Help();
    expect(helper.preformatted(' a b c')).toBe(false);
  });

  test('when unix line break not followed by whitespace then false', () => {
    const helper = new Help();
    expect(helper.preformatted('a\nb\nc')).toBe(false);
  });

  test('when Windows line break not followed by whitespace then false', () => {
    const helper = new Help();
    expect(helper.preformatted('a\r\nb\r\nc')).toBe(false);
  });

  test('when unix line followed by whitespace then true', () => {
    const helper = new Help();
    expect(helper.preformatted('a\n  b')).toBe(true);
  });

  test('when Windows line break followed by whitespace then true', () => {
    const helper = new Help();
    expect(helper.preformatted('a\r\n  b')).toBe(true);
  });

  test('when empty unix lines then false', () => {
    const helper = new Help();
    expect(helper.preformatted('a\n\n')).toBe(false);
  });

  test('when empty Windows lines then false', () => {
    const helper = new Help();
    expect(helper.preformatted('a\r\n\r\n')).toBe(false);
  });
});

test('end-to-end: when option description is preformatted then manual format is preserved', () => {
  // #396: leave custom format alone, apart from space-space indent
  const optionSpec = '-t, --time <HH:MM>';
  const program = new Command();
  program.configureHelp({ helpWidth: 80 }).option(
    optionSpec,
    `select time

Time can also be specified using special values:
  "dawn" - From night to sunrise.
`,
  );

  const expectedOutput = `Usage:  [options]

Options:
  ${optionSpec}  select time
  
  Time can also be specified using special values:
    "dawn" - From night to sunrise.
  
  -h, --help          display help for command
`;

  expect(program.helpInformation()).toBe(expectedOutput);
});
