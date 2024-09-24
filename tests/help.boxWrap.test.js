const commander = require('../');

test('when empty string then return empty string', () => {
  const helper = new commander.Help();
  const text = '';
  const wrapped = helper.boxWrap(text, 50);
  expect(wrapped).toEqual(text);
});

test('when string contains unix line breaks then return (unix) empty lines', () => {
  const helper = new commander.Help();
  const text = '\n\n\n';
  const wrapped = helper.boxWrap(text, 50);
  expect(wrapped).toEqual(text);
});

test('when string contains Windows line breaks then return (unix)) empty lines', () => {
  const helper = new commander.Help();
  const text = '\r\n\r\n\r\n';
  const wrapped = helper.boxWrap(text, 50);
  expect(wrapped).toEqual('\n\n\n');
});

test('when string contains only whitespace then returns empty string (trim right)', () => {
  const helper = new commander.Help();
  const text = ' \t  ';
  const wrapped = helper.boxWrap(text, 50);
  expect(wrapped).toEqual('');
});

test('when string contains leading whitespace then returns string with leading whitespace', () => {
  const helper = new commander.Help();
  const text = '  abc   ';
  const wrapped = helper.boxWrap(text, 50);
  expect(wrapped).toEqual('  abc');
});

test('when string contains intermediate whitespace then returns string with intermediate whitespace', () => {
  const helper = new commander.Help();
  const text = '123   456   ';
  const wrapped = helper.boxWrap(text, 50);
  expect(wrapped).toEqual('123   456');
});

test('when string contains escape sequences then returns string with escape sequences', () => {
  const helper = new commander.Help();
  const text = '123   456   ';
  const wrapped = helper.boxWrap(text, 50);
  expect(wrapped).toEqual('123   456');
});

test('when string has enough words to wrap then returns two wrapped lines', () => {
  const helper = new commander.Help();
  const text = '123 567 901 345 789 123 567 901 345 789 123 567 901';
  const wrapped = helper.boxWrap(text, 45);
  expect(wrapped).toEqual(
    '123 567 901 345 789 123 567 901 345 789 123\n567 901',
  );
});

test('when string has enough words to wrap twice times then returns three wrapped lines', () => {
  const helper = new commander.Help();
  const text = 'abc '.repeat(20);
  const wrapped = helper.boxWrap(text, 46);
  expect(wrapped).toEqual(`${'abc '.repeat(10)}abc
${'abc '.repeat(8)}abc`);
});

test('when string has enough words and escape sequences to wrap then returns wrapped line ignoring escape sequences', () => {
  const helper = new commander.Help();
  const CSI = '\u001b[';
  const underlinedText = `${CSI}4mXYZ${CSI}24m`;
  const text = `${underlinedText}${' ABC'.repeat(19)}`;
  const wrapped = helper.boxWrap(text, 44);
  expect(wrapped).toEqual(`${underlinedText} ${'ABC '.repeat(9)}ABC
${'ABC '.repeat(8)}ABC`);
});
