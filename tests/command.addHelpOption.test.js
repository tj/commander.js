import { Option } from '../index.js';
import { createTestCommand } from './testHelpers.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// More complete tests are in command.helpOption.test.js.

describe('Command.addHelpOption()', () => {
  test('when addHelpOption has custom flags then custom short flag invokes help', () => {
    const program = createTestCommand();
    program.addHelpOption(new Option('-c,--custom-help'));

    assert.throws(
      () => {
        program.parse(['-c'], { from: 'user' });
      },
      { message: '(outputHelp)' },
    );
  });

  test('when addHelpOption has custom flags then custom long flag invokes help', () => {
    const program = createTestCommand();
    program.addHelpOption(new Option('-c,--custom-help'));

    assert.throws(
      () => {
        program.parse(['--custom-help'], { from: 'user' });
      },
      { message: '(outputHelp)' },
    );
  });

  test('when addHelpOption with hidden help option then help does not include help option', () => {
    const program = createTestCommand();
    program.addHelpOption(
      new Option('-c,--custom-help', 'help help help').hideHelp(),
    );
    const helpInfo = program.helpInformation();
    assert.doesNotMatch(helpInfo, /help/);
  });
});
