const { Command, Option } = require('../');

// We also do some low level tests in i18n.test.js
// Can fill out tests more when have an actual translation!

test('when load locale then also used to format lists', () => {
  const program = new Command()
    .locale('en')
    .addOption(new Option('--choose').choices(['red', 'blue']));
  expect(program.helpInformation()).toMatch('"red" or "blue"');
});

test('when locale missing then throw', () => {
  const program = new Command();
  expect(() => {
    // Change target if add a translation for isiZulu.
    program.locale('zu');
  }).toThrow("Commander: translations not found for locale 'zu'");
});
