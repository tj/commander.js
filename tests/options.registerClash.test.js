import { Command, Option } from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('registering clashing options', () => {
  test('when short option flag conflicts then throws', () => {
    const program = new Command();
    assert.throws(
      () => {
        program
          .option('-c, --cheese <type>', 'cheese type')
          .option('-c, --conflict');
      },
      {
        message: /Cannot add option/,
      },
    );
  });

  test('when long option flag conflicts then throws', () => {
    const program = new Command();
    assert.throws(
      () => {
        program
          .option('-c, --cheese <type>', 'cheese type')
          .option('-H, --cheese');
      },
      { message: /Cannot add option/ },
    );
  });

  test('when use help options separately then does not throw', () => {
    assert.doesNotThrow(() => {
      const program = new Command();
      program.option('-h, --help', 'display help');
    });
  });

  test('when reuse flags in subcommand then does not throw', () => {
    assert.doesNotThrow(() => {
      const program = new Command();
      program.option('-e, --example');
      program.command('sub').option('-e, --example');
    });
  });
});

describe('.addOption()', () => {
  test('when short option flags conflicts then throws', () => {
    const program = new Command();
    assert.throws(() => {
      program
        .option('-c, --cheese <type>', 'cheese type')
        .addOption(new Option('-c, --conflict'));
    }, /conflicting flag/);
  });

  test('when long option flags conflicts then throws', () => {
    const program = new Command();
    assert.throws(() => {
      program
        .option('-c, --cheese <type>', 'cheese type')
        .addOption(new Option('-H, --cheese'));
    }, /conflicting flag/);
  });
});
