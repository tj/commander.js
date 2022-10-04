const { Command, Option } = require('../');

// We also do some low level tests in i18n.test.js

test('when configure error message and error then returns updated message', () => {
  let errorMessage;
  const program = new Command()
    .exitOverride()
    .configureOutput({
      writeErr: (message) => { errorMessage = message; }
    })
    .configureStrings({ "error: unknown option '{0}'": "Error: BAD OPTION '{0}'" });

  expect(() => {
    program.parse(['--surprise'], { from: 'user' });
  }).toThrow();
  expect(errorMessage).toEqual("Error: BAD OPTION '--surprise'\n");
});

test('when configure help title and get help then includes updated string', () => {
  const program = new Command()
    .configureStrings({ 'Usage:': 'Used thusly:' });
  expect(program.helpInformation()).toMatch('Used thusly:');
});

test('when specify unknown locale then fallback used to format lists', () => {
  const program = new Command()
    .configureStrings({}, 'esperanto')
    .addOption(new Option('--choose').choices(['red', 'blue']));
  expect(program.helpInformation()).toMatch('"red", "blue"');
});

test('when specify recognised locale then used to format lists', () => {
  const program = new Command()
    .configureStrings({}, 'en')
    .addOption(new Option('--choose').choices(['red', 'blue']));
  expect(program.helpInformation()).toMatch('"red" or "blue"');
});
