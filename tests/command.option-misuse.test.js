const { Command, Option } = require('../');

// It is a reasonable and easy mistake to pass Option to .option(). Detect this
// and offer advice.

const expectedMessage =
  'To add an Option object use addOption() instead of option() or requiredOption()';

test('when pass Option to .option() then throw', () => {
  const program = new Command();

  expect(() => {
    program.option(new Option('-d, debug'));
  }).toThrow(expectedMessage);
});

test('when pass Option to .requiredOption() then throw', () => {
  const program = new Command();

  expect(() => {
    program.requiredOption(new Option('-d, debug'));
  }).toThrow(expectedMessage);
});
