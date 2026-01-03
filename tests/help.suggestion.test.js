const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { Command, Option } = require('../');

// Note: setting up shared command configuration in getSuggestion,
// and looking for possible subcommand 'sub'.

function getSuggestion(program, arg) {
  let message = '';
  program
    .showSuggestionAfterError() // make sure on
    .exitOverride()
    .configureOutput({
      writeErr: (str) => {
        message = str;
      },
    });
  // Do the same setup for subcommand.
  const sub = program._findCommand('sub');
  if (sub) sub.copyInheritedSettings(program);

  try {
    // Passing in an array for a few of the tests.
    const args = Array.isArray(arg) ? arg : [arg];
    program.parse(args, { from: 'user' });
  } catch (err) {
    /* empty */
  }

  const match = message.match(/Did you mean (one of )?(.*)\?/);
  return match ? match[2] : null;
}

const commandSuggestionTable = [
  ['yyy', ['zzz'], null, 'none similar'],
  ['a', ['b'], null, 'one edit away but not similar'],
  ['a', ['ab'], 'ab', 'one edit away'],
  ['ab', ['a'], null, 'one edit away'],
  ['at', ['cat'], 'cat', '1 insertion'],
  ['cat', ['at'], 'at', '1 deletion'],
  ['bat', ['cat'], 'cat', '1 substitution'],
  ['act', ['cat'], 'cat', '1 transposition'],
  ['cxx', ['cat'], null, '2 edits away and short string'],
  ['caxx', ['cart'], 'cart', '2 edits away and longer string'],
  [
    '1234567',
    ['1234567890'],
    '1234567890',
    '3 edits away is similar for long string',
  ],
  ['123456', ['1234567890'], null, '4 edits is too far'],
  ['xat', ['rat', 'cat', 'bat'], 'bat, cat, rat', 'sorted possibles'],
  [
    'cart',
    ['camb', 'cant', 'bard'],
    'cant',
    'only closest of different edit distances',
  ],
];

test('command suggestions', () => {
  commandSuggestionTable.forEach(
    ([arg, commandNames, expected, description]) => {
      const program = new Command();
      commandNames.forEach((name) => {
        program.command(name);
      });
      const suggestion = getSuggestion(program, arg);
      assert.equal(suggestion, expected);
    },
  );
});

test('when similar alias then suggest alias', () => {
  const program = new Command();
  program.command('xyz').alias('car');
  const suggestion = getSuggestion(program, 'bar');
  assert.equal(suggestion, 'car');
});

test('when similar hidden alias then not suggested', () => {
  const program = new Command();
  program.command('xyz').alias('visible').alias('silent');
  const suggestion = getSuggestion(program, 'slent');
  assert.equal(suggestion, null);
});

test('when similar command and alias then suggest both', () => {
  const program = new Command();
  program.command('aaaaa').alias('cat');
  program.command('bat');
  program.command('ccccc');
  const suggestion = getSuggestion(program, 'mat');
  assert.equal(suggestion, 'bat, cat');
});

test('when implicit help command then help is candidate for suggestion', () => {
  const program = new Command();
  program.command('sub');
  const suggestion = getSuggestion(program, 'hepl');
  assert.equal(suggestion, 'help');
});

test('when help command disabled then not candidate for suggestion', () => {
  const program = new Command();
  program.addHelpCommand(false);
  program.command('sub');
  const suggestion = getSuggestion(program, 'hepl');
  assert.equal(suggestion, null);
});

test('when default help option then --help is candidate for suggestion', () => {
  const program = new Command();
  const suggestion = getSuggestion(program, '--hepl');
  assert.equal(suggestion, '--help');
});

test('when custom help option then --custom-help is candidate for suggestion', () => {
  const program = new Command();
  program.helpOption('-H, --custom-help');
  const suggestion = getSuggestion(program, '--custom-hepl');
  assert.equal(suggestion, '--custom-help');
});

test('when help option disabled then not candidate for suggestion', () => {
  const program = new Command();
  program.helpOption(false);
  const suggestion = getSuggestion(program, '--hepl');
  assert.equal(suggestion, null);
});

test('when command:* listener and unknown command then no suggestion', () => {
  // Because one use for command:* was to handle unknown commands.
  // Listener actually stops error being thrown, but we just care about affect on suggestion in this test.
  const program = new Command();
  program.on('command:*', () => {});
  program.command('rat');
  const suggestion = getSuggestion(program, 'cat');
  assert.equal(suggestion, null);
});

const optionSuggestionTable = [
  ['--yyy', ['--zzz'], null, 'none similar'],
  ['--a', ['--b'], null, 'one edit away but not similar'],
  ['--a', ['--ab'], '--ab', 'one edit away'],
  ['--ab', ['--a'], null, 'one edit away'],
  ['--at', ['--cat'], '--cat', '1 insertion'],
  ['--cat', ['--at'], '--at', '1 deletion'],
  ['--bat', ['--cat'], '--cat', '1 substitution'],
  ['--act', ['--cat'], '--cat', '1 transposition'],
  ['--cxx', ['--cat'], null, '2 edits away and short string'],
  ['--caxx', ['--cart'], '--cart', '2 edits away and longer string'],
  [
    '--1234567',
    ['--1234567890'],
    '--1234567890',
    '3 edits away is similar for long string',
  ],
  ['--123456', ['--1234567890'], null, '4 edits is too far'],
  [
    '--xat',
    ['--rat', '--cat', '--bat'],
    '--bat, --cat, --rat',
    'sorted possibles',
  ],
  [
    '--cart',
    ['--camb', '--cant', '--bard'],
    '--cant',
    'only closest of different edit distances',
  ],
];

test('option suggestions', () => {
  optionSuggestionTable.forEach(
    ([arg, commandNames, expected, description]) => {
      const program = new Command();
      commandNames.forEach((name) => {
        program.option(name);
      });
      const suggestion = getSuggestion(program, arg);
      assert.equal(suggestion, expected);
    },
  );
});

test('when no options then no suggestion', () => {
  // Checking nothing blows up as much as no suggestion!
  const program = new Command();
  program.helpOption(false);
  const suggestion = getSuggestion(program, '--option');
  assert.equal(suggestion, null);
});

test('when subcommand option then candidate for subcommand option suggestion', () => {
  const program = new Command();
  program.command('sub').option('-l,--local');
  const suggestion = getSuggestion(program, ['sub', '--loca']);
  assert.equal(suggestion, '--local');
});

test('when global option then candidate for subcommand option suggestion', () => {
  const program = new Command();
  program.option('-g, --global');
  program.command('sub');
  const suggestion = getSuggestion(program, ['sub', '--globla']);
  assert.equal(suggestion, '--global');
});

test('when global option but positionalOptions then not candidate for subcommand suggestion', () => {
  const program = new Command();
  program.enablePositionalOptions();
  program.option('-g, --global');
  program.command('sub');
  const suggestion = getSuggestion(program, ['sub', '--globla']);
  assert.equal(suggestion, null);
});

test('when global and local options then both candidates', () => {
  const program = new Command();
  program.option('--cat');
  program.command('sub').option('--rat');
  const suggestion = getSuggestion(program, ['sub', '--bat']);
  assert.equal(suggestion, '--cat, --rat');
});

test('when command hidden then not suggested as candidate', () => {
  const program = new Command();
  program.command('secret', { hidden: true });
  const suggestion = getSuggestion(program, 'secrt');
  assert.equal(suggestion, null);
});

test('when option hidden then not suggested as candidate', () => {
  const program = new Command();
  program.addOption(new Option('--secret').hideHelp());
  const suggestion = getSuggestion(program, '--secrt');
  assert.equal(suggestion, null);
});

test('when may be duplicate identical candidates then only return one', () => {
  const program = new Command();
  program.command('sub');
  const suggestion = getSuggestion(program, ['sub', '--hepl']);
  assert.equal(suggestion, '--help');
});
