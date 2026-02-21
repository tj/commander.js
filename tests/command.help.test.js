import * as commander from '../index.js';
import { createTestCommand } from './testHelpers.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Testing various help incantations.
//
// Note there are also specific help tests included in many of the feature tests,
// such as the alias, version, usage, name, helpOption, and commandHelp tests.

describe('help handling', () => {
  // Avoid doing many full format tests as will be broken by any layout changes!
  test('when call helpInformation for program then help format is as expected (usage, options, commands)', () => {
    const program = new commander.Command();
    program.command('my-command <file>');
    const expectedHelpInformation = `Usage: test [options] [command]

Options:
  -h, --help         display help for command

Commands:
  my-command <file>
  help [command]     display help for command
`;

    program.name('test');
    const helpInformation = program.helpInformation();
    assert.equal(helpInformation, expectedHelpInformation);
  });

  test('when use .description for command then help includes description', () => {
    const program = new commander.Command();
    program.command('simple-command').description('custom-description');
    program._help = 'test';
    const helpInformation = program.helpInformation();
    assert.match(helpInformation, /simple-command +custom-description/);
  });

  test('when call .help then exit', (t) => {
    const program = createTestCommand();
    assert.throws(
      () => {
        program.help();
      },
      { message: '(outputHelp)' },
    );
  });

  test('when specify --help then exit', (t) => {
    const program = createTestCommand();
    assert.throws(
      () => {
        program.parse(['node', 'test', '--help']);
      },
      { message: '(outputHelp)' },
    );
  });

  test('when call help(cb) then display cb output and exit', (t) => {
    // Using spy to detect custom output
    const writeSpy = t.mock.method(process.stdout, 'write', () => {});
    const helpReplacement = 'reformatted help';
    const program = new commander.Command();
    program.exitOverride();
    assert.throws(
      () => {
        program.help((helpInformation) => {
          return helpReplacement;
        });
      },
      { message: '(outputHelp)' },
    );
    assert.equal(writeSpy.mock.callCount(), 1);
    assert.deepEqual(writeSpy.mock.calls[0].arguments, [helpReplacement]);
  });

  test('when call outputHelp(cb) then display cb output', (t) => {
    // Using spy to detect custom output
    const writeSpy = t.mock.method(process.stdout, 'write', () => {});
    const helpReplacement = 'reformatted help';
    const program = new commander.Command();
    program.outputHelp((helpInformation) => {
      return helpReplacement;
    });
    assert.equal(writeSpy.mock.callCount(), 1);
    assert.deepEqual(writeSpy.mock.calls[0].arguments, [helpReplacement]);
  });

  test('when call deprecated outputHelp(cb) with wrong callback return type then throw', () => {
    const program = new commander.Command();
    assert.throws(() => {
      program.outputHelp((helpInformation) => 3);
    });
  });

  test('when command sets deprecated noHelp then not displayed in helpInformation', () => {
    const program = new commander.Command();
    program.command('secret', 'secret description', { noHelp: true });
    const helpInformation = program.helpInformation();
    assert(!helpInformation.includes('secret'));
  });

  test('when command sets hidden then not displayed in helpInformation', () => {
    const program = new commander.Command();
    program.command('secret', 'secret description', { hidden: true });
    const helpInformation = program.helpInformation();
    assert(!helpInformation.includes('secret'));
  });

  test('when addCommand with hidden:true then not displayed in helpInformation', () => {
    const secretCmd = new commander.Command('secret');

    const program = new commander.Command();
    program.addCommand(secretCmd, { hidden: true });
    const helpInformation = program.helpInformation();
    assert(!helpInformation.includes('secret'));
  });

  test('when help short flag masked then not displayed in helpInformation', () => {
    const program = new commander.Command();
    program.option('-h, --host', 'select host');
    const helpInformation = program.helpInformation();
    assert(helpInformation.includes(' -h, --host'));
    assert(!helpInformation.includes(' -h, --help'));
    assert(helpInformation.includes(' --help'));
  });

  test('when both help flags masked then not displayed in helpInformation', () => {
    const program = new commander.Command();
    program.option('-h, --help', 'custom');
    const helpInformation = program.helpInformation();
    assert(!helpInformation.includes('display help'));
  });

  test('when call .help then output on stdout', (t) => {
    const writeSpy = t.mock.method(process.stdout, 'write', () => {});
    const program = new commander.Command();
    program.exitOverride();
    assert.throws(
      () => {
        program.help();
      },
      { message: '(outputHelp)' },
    );
    assert.equal(writeSpy.mock.callCount(), 1);
    assert.deepEqual(writeSpy.mock.calls[0].arguments, [
      program.helpInformation(),
    ]);
  });

  test('when call .help with { error: true } then output on stderr', (t) => {
    const writeSpy = t.mock.method(process.stderr, 'write', () => {});
    const program = new commander.Command();
    program.exitOverride();
    assert.throws(
      () => {
        program.help({ error: true });
      },
      { message: '(outputHelp)' },
    );
    assert.equal(writeSpy.mock.callCount(), 1);
    assert.deepEqual(writeSpy.mock.calls[0].arguments, [
      program.helpInformation(),
    ]);
  });

  test('when no options then Options not included in helpInformation', () => {
    const program = new commander.Command();
    // No custom options, no version option, no help option
    program.helpOption(false);
    const helpInformation = program.helpInformation();
    assert(!helpInformation.includes('Options'));
  });

  test('when negated option then option included in helpInformation', () => {
    const program = new commander.Command();
    program.option('-C, --no-colour', 'colourless');
    const helpInformation = program.helpInformation();
    assert(helpInformation.includes('--no-colour'));
    assert(helpInformation.includes('colourless'));
  });

  test('when option.hideHelp() then option not included in helpInformation', () => {
    const program = new commander.Command();
    program.addOption(
      new commander.Option('-s,--secret', 'secret option').hideHelp(),
    );
    const helpInformation = program.helpInformation();
    assert(!helpInformation.includes('secret'));
  });

  test('when option.hideHelp(true) then option not included in helpInformation', () => {
    const program = new commander.Command();
    program.addOption(
      new commander.Option('-s,--secret', 'secret option').hideHelp(true),
    );
    const helpInformation = program.helpInformation();
    assert(!helpInformation.includes('secret'));
  });

  test('when option.hideHelp(false) then option included in helpInformation', () => {
    const program = new commander.Command();
    program.addOption(
      new commander.Option('-s,--secret', 'secret option').hideHelp(false),
    );
    const helpInformation = program.helpInformation();
    assert(helpInformation.includes('secret'));
  });

  test('when option has default value then default included in helpInformation', () => {
    const program = new commander.Command();
    program.option('-p, --port <portNumber>', 'port number', 80);
    const helpInformation = program.helpInformation();
    assert(helpInformation.includes('(default: 80)'));
  });

  test('when option has default value description then default description included in helpInformation', () => {
    const program = new commander.Command();
    program.addOption(
      new commander.Option('-a, --address <dotted>', 'ip address').default(
        '127.0.0.1',
        'home',
      ),
    );
    const helpInformation = program.helpInformation();
    assert(helpInformation.includes('(default: home)'));
  });

  test('when option has choices then choices included in helpInformation', () => {
    const program = new commander.Command();
    program.addOption(
      new commander.Option('-c, --colour <colour>').choices(['red', 'blue']),
    );
    const helpInformation = program.helpInformation();
    assert(helpInformation.includes('(choices: "red", "blue")'));
  });

  test('when option has choices and default then both included in helpInformation', () => {
    const program = new commander.Command();
    program.addOption(
      new commander.Option('-c, --colour <colour>')
        .choices(['red', 'blue'])
        .default('red'),
    );
    const helpInformation = program.helpInformation();
    assert(
      helpInformation.includes('(choices: "red", "blue", default: "red")'),
    );
  });

  test('when argument then included in helpInformation', () => {
    const program = new commander.Command();
    program.name('foo').argument('<file>');
    const helpInformation = program.helpInformation();
    assert(helpInformation.includes('Usage: foo [options] <file>'));
  });

  test('when argument described then included in helpInformation', () => {
    const program = new commander.Command();
    program.argument('<file>', 'input source').helpOption(false);
    const helpInformation = program.helpInformation();
    assert.match(helpInformation, /Arguments:\n +file +input source/);
  });

  test('when argument described with default then included in helpInformation', () => {
    const program = new commander.Command();
    program.argument('[file]', 'input source', 'test.txt').helpOption(false);
    const helpInformation = program.helpInformation();
    assert.match(
      helpInformation,
      /Arguments:\n +file +input source \(default: "test.txt"\)/,
    );
  });

  test('when arguments described in deprecated way then included in helpInformation', () => {
    const program = new commander.Command();
    program
      .arguments('<file>')
      .helpOption(false)
      .description('description', { file: 'input source' });
    const helpInformation = program.helpInformation();
    assert.match(helpInformation, /Arguments:\n +file +input source/);
  });

  test('when arguments described in deprecated way and empty description then arguments still included in helpInformation', () => {
    const program = new commander.Command();
    program
      .arguments('<file>')
      .helpOption(false)
      .description('', { file: 'input source' });
    const helpInformation = program.helpInformation();
    assert.match(helpInformation, /Arguments:\n +file +input source/);
  });

  test('when argument has choices then choices included in helpInformation', () => {
    const program = new commander.Command();
    program.addArgument(
      new commander.Argument('<colour>', 'preferred colour').choices([
        'red',
        'blue',
      ]),
    );
    const helpInformation = program.helpInformation();
    assert(helpInformation.includes('(choices: "red", "blue")'));
  });

  test('when argument has choices and default then both included in helpInformation', () => {
    const program = new commander.Command();
    program.addArgument(
      new commander.Argument('<colour>', 'preferred colour')
        .choices(['red', 'blue'])
        .default('red'),
    );
    const helpInformation = program.helpInformation();
    assert(
      helpInformation.includes('(choices: "red", "blue", default: "red")'),
    );
  });
});
