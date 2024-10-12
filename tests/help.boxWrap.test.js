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
  const text = '  abc';
  const wrapped = helper.boxWrap(text, 50);
  expect(wrapped).toEqual('  abc');
});

test('when string contains intermediate whitespace then returns string with intermediate whitespace', () => {
  const helper = new commander.Help();
  const text = '123   456';
  const wrapped = helper.boxWrap(text, 50);
  expect(wrapped).toEqual('123   456');
});

test('when string contains trailing whitespace then returns string without trailing whitespace (trim right)', () => {
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

test('when string has enough words and escape sequences to wrap then returns wrapped line with break ignoring escape sequences', () => {
  const helper = new commander.Help();
  const CSI = '\u001b[';
  const underlinedText = `${CSI}4mXYZ${CSI}24m`;
  const text = `${underlinedText}${' ABC'.repeat(19)}`;
  const wrapped = helper.boxWrap(text, 44);
  expect(wrapped).toEqual(`${underlinedText} ${'ABC '.repeat(9)}ABC
${'ABC '.repeat(8)}ABC`);
});

test('when first word longer than width then soft wrap', () => {
  const helper = new commander.Help();
  const text = 'abc'.repeat(20);
  const wrapped = helper.boxWrap(text, 40);
  expect(wrapped).toEqual(text);
});

test('when second word longer than width then wrap and soft wrap', () => {
  const helper = new commander.Help();
  const text = 'xyz ' + 'abc'.repeat(20);
  const wrapped = helper.boxWrap(text, 40);
  expect(wrapped).toEqual(`xyz\n${'abc'.repeat(20)}`);
});

test('when set width 41 then wrap at 41', () => {
  const helper = new commander.Help();
  const text = 'X'.repeat(39) + ' 1 2 3';
  let wrapped = helper.boxWrap(text, 40);
  expect(wrapped).toEqual('X'.repeat(39) + '\n1 2 3');
  wrapped = helper.boxWrap(text, 41);
  expect(wrapped).toEqual('X'.repeat(39) + ' 1\n2 3');
});

test('when set width 12 (too small) then skip wrap', () => {
  const helper = new commander.Help();
  const text = ' x'.repeat(8) + ' yy'.repeat(6);
  let wrapped = helper.boxWrap(text, 14);
  expect(wrapped).toEqual(text);
});

test('when set width 12 (and set minWrapWidth) then skip wrap', () => {
  const helper = new commander.Help();
  helper.minWidthToWrap = 1;
  const text = ' x'.repeat(8) + ' yy'.repeat(6);
  let wrapped = helper.boxWrap(text, 14);
  expect(wrapped).toEqual(' x x x x x x x\nx yy yy yy yy\nyy yy');
});
