const fs = require('fs');
const path = require('path');
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

test('when load any of existing locales then does not error', () => {
  // Sanity check that don't have syntax error in JSON file!
  const localeDir = path.join(__dirname, '..', 'locales');
  const locales = fs.readdirSync(localeDir)
    .filter(filename => filename.endsWith('.json'))
    .map(filename => path.basename(filename, '.json'));
  locales.forEach((locale) => {
    expect(() => {
      const program = new Command();
      program.locale(locale);
    }).not.toThrow();
  });
});
