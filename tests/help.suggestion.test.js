const { Command } = require('../');

function getSuggestion(program, arg) {
  let message = '';
  program.exitOverride();
  program.configureOutput({
    writeErr: (str) => { message = str; }
  });
  try {
    program.parse([arg], { from: 'user' });
  } catch (err) {
  }

  const match = message.match(/Did you mean (.*)\?/);
  return match ? match[1] : null;
};

test.each([
  ['yyy', ['zzz'], null, 'none similar'],
  ['a', ['ab'], null, 'no suggestions for single char'],
  ['ab', ['a'], null, 'no suggestions of single char'],
  ['at', ['cat'], 'cat', '1 insertion'],
  ['cat', ['at'], 'at', '1 deletion'],
  ['bat', ['cat'], 'cat', '1 substitution'],
  ['act', ['cat'], 'cat', '1 transposition'],
  ['cxx', ['cat'], null, '2 edits away and short string'],
  ['caxx', ['cart'], 'cart', '2 edits away and longer string'],
  ['1234567xxx', ['1234567890'], null, '3 edits away is too far'],
  ['xat', ['rat', 'cat', 'bat'], 'rat', 'first of similar possibles'],
  ['cart', ['camb', 'cant', 'bard'], 'cant', 'closest of different edit distances'],
  ['carte', ['crate', 'carted'], 'carted', 'most similar of same edit distances (longer)']
])('when cli of %s and commands %j then suggest %s because %s', (arg, commandNames, expected) => {
  const program = new Command();
  commandNames.forEach(name => { program.command(name); });
  const suggestion = getSuggestion(program, arg);
  expect(suggestion).toBe(expected);
});

test('when similar single alias then suggest alias', () => {
  const program = new Command();
  program.command('xyz')
    .alias('car');
  const suggestion = getSuggestion(program, 'bar');
  expect(suggestion).toBe('car');
});

test('when similar hidden alias then suggest alias', () => {
  const program = new Command();
  program.command('xyz')
    .alias('visible')
    .alias('silent');
  const suggestion = getSuggestion(program, 'slent');
  expect(suggestion).toBe('silent');
});

test('when similar command and alias then suggest command', () => {
  const program = new Command();
  program.command('aaaaa')
    .alias('cat');
  program.command('bat');
  program.command('ccccc');
  const suggestion = getSuggestion(program, 'mat');
  expect(suggestion).toBe('bat');
});
