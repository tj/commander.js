import * as commander from '../index.js';
import { createTestCommand } from './testHelpers.mjs';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('help handling of subcommands', () => {
  describe('help command listed in helpInformation', () => {
    test('when program has no subcommands then no automatic help command', () => {
      const program = new commander.Command();
      const helpInformation = program.helpInformation();
      assert.doesNotMatch(helpInformation, /help \[command\]/);
    });

    test('when program has no subcommands and add help command then has help command', () => {
      const program = new commander.Command();
      program.addHelpCommand(true);
      const helpInformation = program.helpInformation();
      assert.match(helpInformation, /help \[command\]/);
    });

    test('when program has subcommands then has automatic help command', () => {
      const program = new commander.Command();
      program.command('foo');
      const helpInformation = program.helpInformation();
      assert.match(helpInformation, /help \[command\]/);
    });

    test('when program has subcommands and specify only unknown option then display help', () => {
      const program = createTestCommand();
      program.allowUnknownOption().command('foo');
      assert.throws(
        () => {
          program.parse(['--unknown'], { from: 'user' });
        },
        {
          code: 'commander.help',
        },
      );
    });

    test('when program has subcommands and suppress help command then no help command', () => {
      const program = new commander.Command();
      program.addHelpCommand(false);
      program.command('foo');
      const helpInformation = program.helpInformation();
      assert.doesNotMatch(helpInformation, /help \[command\]/);
    });

    test('when add custom help command then custom help command', () => {
      const program = new commander.Command();
      program.addHelpCommand('myHelp', 'help description');
      const helpInformation = program.helpInformation();
      assert.match(helpInformation, /myHelp +help description/);
    });
  });

  describe('help command processed on correct command', () => {
    function makeCommand() {
      const program = new commander.Command();
      program.configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      });

      return program;
    }

    test('when "program help" then program', () => {
      const program = makeCommand();
      program.exitOverride();
      program.command('sub1');
      program.exitOverride(() => {
        throw new Error('program');
      });
      assert.throws(() => {
        program.parse('node test.js help'.split(' '));
      }, /program/);
    });

    test('when "program help unknown" then program', () => {
      const program = makeCommand();
      program.exitOverride();
      program.command('sub1');
      program.exitOverride(() => {
        throw new Error('program');
      });
      assert.throws(() => {
        program.parse('node test.js help unknown'.split(' '));
      }, /program/);
    });

    test('when "program help sub1" then sub1', () => {
      const program = makeCommand();
      program.exitOverride();
      const sub1 = program.command('sub1');
      sub1.exitOverride(() => {
        throw new Error('sub1');
      });
      assert.throws(() => {
        program.parse('node test.js help sub1'.split(' '));
      }, /sub1/);
    });

    test('when "program sub1 help sub2" then sub2', () => {
      const program = makeCommand();
      program.exitOverride();
      const sub1 = program.command('sub1');
      const sub2 = sub1.command('sub2');
      sub2.exitOverride(() => {
        throw new Error('sub2');
      });
      assert.throws(() => {
        program.parse('node test.js sub1 help sub2'.split(' '));
      }, /sub2/);
    });

    test('when default command and "program help" then program', () => {
      const program = makeCommand();
      program.exitOverride();
      program.command('sub1', { isDefault: true });
      program.exitOverride(() => {
        throw new Error('program');
      });
      assert.throws(() => {
        program.parse('node test.js help'.split(' '));
      }, /program/);
    });

    test('when no long help flag then "help sub" works', () => {
      const program = makeCommand();
      program.exitOverride();
      program.helpOption('-H');
      const sub = program.command('sub');
      // Patch help for easy way to check called.
      sub.help = () => {
        throw new Error('sub help');
      };
      assert.throws(() => {
        program.parse(['help', 'sub'], { from: 'user' });
      }, /sub help/);
    });

    test('when no help options in sub then "help sub" works', () => {
      const program = makeCommand();
      program.exitOverride();
      const sub = program.command('sub').helpOption(false);
      // Patch help for easy way to check called.
      sub.help = () => {
        throw new Error('sub help');
      };
      assert.throws(() => {
        program.parse(['help', 'sub'], { from: 'user' });
      }, /sub help/);
    });

    test('when different help options in sub then "help sub" works', () => {
      const program = makeCommand();
      program.exitOverride();
      const sub = program.command('sub');
      program.helpOption('-h, --help');
      sub.helpOption('-a, --assist');
      // Patch help for easy way to check called.
      sub.help = () => {
        throw new Error('sub help');
      };
      assert.throws(() => {
        program.parse(['help', 'sub'], { from: 'user' });
      }, /sub help/);
    });
  });
});
