import * as commander from '../index.js';
import { createTestCommand } from './testHelpers.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Assuming mandatory options behave as normal options apart from the mandatory aspect, not retesting all behaviour.
// Likewise, not redoing all tests on subcommand after testing on program.

describe('Command.requiredOption()', () => {
  describe('required program option with mandatory value specified', () => {
    test('when program has required value specified then value as specified', () => {
      const program = new commander.Command();
      program.requiredOption('--cheese <type>', 'cheese type');
      program.parse(['node', 'test', '--cheese', 'blue']);
      assert.equal(program.opts().cheese, 'blue');
    });

    test('when program has option with name different than property then still recognised', () => {
      const program = new commander.Command();
      program.requiredOption('--cheese-type <type>', 'cheese type');
      program.parse(['node', 'test', '--cheese-type', 'blue']);
      assert.equal(program.opts().cheeseType, 'blue');
    });

    test('when program has required value default then default value', () => {
      const program = new commander.Command();
      program.requiredOption('--cheese <type>', 'cheese type', 'default');
      program.parse(['node', 'test']);
      assert.equal(program.opts().cheese, 'default');
    });

    test('when program has optional value flag specified then true', () => {
      const program = new commander.Command();
      program.requiredOption('--cheese [type]', 'cheese type');
      program.parse(['node', 'test', '--cheese']);
      assert.equal(program.opts().cheese, true);
    });

    test('when program has optional value default then default value', () => {
      const program = new commander.Command();
      program.requiredOption('--cheese [type]', 'cheese type', 'default');
      program.parse(['node', 'test']);
      assert.equal(program.opts().cheese, 'default');
    });

    test('when program has value/no flag specified with value then specified value', () => {
      const program = new commander.Command();
      program
        .requiredOption('--cheese <type>', 'cheese type')
        .requiredOption('--no-cheese', 'no cheese thanks');
      program.parse(['node', 'test', '--cheese', 'blue']);
      assert.equal(program.opts().cheese, 'blue');
    });

    test('when program has mandatory-yes/no flag specified with flag then true', () => {
      const program = new commander.Command();
      program
        .requiredOption('--cheese', 'cheese type')
        .option('--no-cheese', 'no cheese thanks');
      program.parse(['node', 'test', '--cheese']);
      assert.equal(program.opts().cheese, true);
    });

    test('when program has mandatory-yes/mandatory-no flag specified with flag then true', () => {
      const program = new commander.Command();
      program
        .requiredOption('--cheese', 'cheese type')
        .requiredOption('--no-cheese', 'no cheese thanks');
      program.parse(['node', 'test', '--cheese']);
      assert.equal(program.opts().cheese, true);
    });

    test('when program has yes/no flag specified negated then false', () => {
      const program = new commander.Command();
      program
        .requiredOption('--cheese <type>', 'cheese type')
        .option('--no-cheese', 'no cheese thanks');
      program.parse(['node', 'test', '--no-cheese']);
      assert.equal(program.opts().cheese, false);
    });

    test('when program has required value specified and subcommand then specified value', () => {
      const program = new commander.Command();
      program
        .requiredOption('--cheese <type>', 'cheese type')
        .command('sub')
        .action(() => {});
      program.parse(['node', 'test', '--cheese', 'blue', 'sub']);
      assert.equal(program.opts().cheese, 'blue');
    });
  });

  describe('required program option with mandatory value not specified', () => {
    test('when program has required option not specified then error', () => {
      const program = createTestCommand();
      program.requiredOption('--cheese <type>', 'cheese type');

      assert.throws(() => {
        program.parse(['node', 'test']);
      });
    });

    test('when program has optional option not specified then error', () => {
      const program = createTestCommand();
      program.requiredOption('--cheese [type]', 'cheese type');

      assert.throws(() => {
        program.parse(['node', 'test']);
      });
    });

    test('when program has yes/no not specified then error', () => {
      const program = createTestCommand();
      program
        .requiredOption('--cheese', 'cheese type')
        .option('--no-cheese', 'no cheese thanks');

      assert.throws(() => {
        program.parse(['node', 'test']);
      });
    });

    test('when program has required value not specified and subcommand then error', () => {
      const program = createTestCommand();
      program
        .requiredOption('--cheese <type>', 'cheese type')
        .command('sub')
        .action(() => {});

      assert.throws(() => {
        program.parse(['node', 'test', 'sub']);
      });
    });
  });

  describe('required command option with mandatory value specified', () => {
    test('when command has required value specified then no error and option has specified value', () => {
      const program = createTestCommand();
      let cmdOptions;
      program
        .command('sub')
        .requiredOption('--subby <type>', 'description')
        .action((options) => {
          cmdOptions = options;
        });

      program.parse(['node', 'test', 'sub', '--subby', 'blue']);

      assert.equal(cmdOptions.subby, 'blue');
    });

    test('when command has required value specified using env then no error and option has specified value', () => {
      const program = createTestCommand();
      program.addOption(
        new commander.Option('-p, --port <number>', 'port number')
          .makeOptionMandatory()
          .env('FOO'),
      );

      process.env.FOO = 'bar';
      program.parse([], { from: 'user' });
      delete process.env.FOO;

      assert.equal(program.opts().port, 'bar');
    });
  });

  describe('required command option with mandatory value not specified', () => {
    test('when command has required value not specified then error', () => {
      const program = createTestCommand();
      program
        .command('sub')
        .requiredOption('--subby <type>', 'description')
        .action(() => {});

      assert.throws(() => {
        program.parse(['node', 'test', 'sub']);
      });
    });

    test('when command has required value but not called then no error', () => {
      const program = createTestCommand();
      program
        .command('sub')
        .requiredOption('--subby <type>', 'description')
        .action(() => {});
      program.command('sub2');

      assert.doesNotThrow(() => {
        program.parse(['node', 'test', 'sub2']);
      });
    });
  });

  describe('missing mandatory option but help requested', () => {
    test('when program has required option not specified and --help then help', () => {
      const program = createTestCommand();
      program.requiredOption('--cheese <type>', 'cheese type');

      assert.throws(
        () => {
          program.parse(['node', 'test', '--help']);
        },
        { code: 'commander.helpDisplayed' },
      );
    });

    test('when program has required option not specified and subcommand --help then help', () => {
      const program = createTestCommand();
      program
        .requiredOption('--cheese <type>', 'cheese type')
        .command('sub')
        .action(() => {});

      assert.throws(
        () => {
          program.parse(['node', 'test', 'sub', '--help']);
        },
        { code: 'commander.helpDisplayed' },
      );
    });
  });
});
