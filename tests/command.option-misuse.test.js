const { Command, Option } = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// It is a reasonable and easy mistake to pass Option to .option(). Detect this
// and offer advice.

const expectedMessage =
  'To add an Option object use addOption() instead of option() or requiredOption()';

describe('Command methods detect and explains misuse when incorrectly pass Option object', () => {
  test('when pass Option to .option() then throw', () => {
    const program = new Command();

    assert.throws(
      () => {
        program.option(new Option('-d, debug'));
      },
      { message: expectedMessage },
    );
  });

  test('when pass Option to .requiredOption() then throw', () => {
    const program = new Command();

    assert.throws(
      () => {
        program.requiredOption(new Option('-d, debug'));
      },
      { message: expectedMessage },
    );
  });
});
