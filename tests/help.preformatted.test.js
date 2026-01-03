const { Help, Command } = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('preformatted', () => {
  test('when single line then false', () => {
    const helper = new Help();
    assert.equal(helper.preformatted('a b c'), false);
  });

  test('when single line with leading whitespace then false', () => {
    const helper = new Help();
    assert.equal(helper.preformatted(' a b c'), false);
  });

  test('when unix line break not followed by whitespace then false', () => {
    const helper = new Help();
    assert.equal(helper.preformatted('a\nb\nc'), false);
  });

  test('when Windows line break not followed by whitespace then false', () => {
    const helper = new Help();
    assert.equal(helper.preformatted('a\r\nb\r\nc'), false);
  });

  test('when unix line followed by whitespace then true', () => {
    const helper = new Help();
    assert.equal(helper.preformatted('a\n  b'), true);
  });

  test('when Windows line break followed by whitespace then true', () => {
    const helper = new Help();
    assert.equal(helper.preformatted('a\r\n  b'), true);
  });

  test('when empty unix lines then false', () => {
    const helper = new Help();
    assert.equal(helper.preformatted('a\n\n'), false);
  });

  test('when empty Windows lines then false', () => {
    const helper = new Help();
    assert.equal(helper.preformatted('a\r\n\r\n'), false);
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

  assert.equal(program.helpInformation(), expectedOutput);
});
