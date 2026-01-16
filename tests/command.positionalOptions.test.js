import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// The changes to parsing for positional options are subtle, and took extra care to work with
// implicit help and default commands. Lots of tests.

describe('positional options using Command.passThroughOptions() and Command.enablePositionalOptions()', () => {
  describe('program with passThrough', () => {
    function makeProgram() {
      const program = new commander.Command();
      program.passThroughOptions();
      program.option('-d, --debug').argument('<args...>');
      return program;
    }

    test('when option before command-argument then option parsed', () => {
      const program = makeProgram();
      program.parse(['--debug', 'arg'], { from: 'user' });
      assert.deepEqual(program.args, ['arg']);
      assert.equal(program.opts().debug, true);
    });

    test('when known option after command-argument then option passed through', () => {
      const program = makeProgram();
      program.parse(['arg', '--debug'], { from: 'user' });
      assert.deepEqual(program.args, ['arg', '--debug']);
      assert.equal(program.opts().debug, undefined);
    });

    test('when unknown option after command-argument then option passed through', () => {
      const program = makeProgram();
      program.parse(['arg', '--pass'], { from: 'user' });
      assert.deepEqual(program.args, ['arg', '--pass']);
    });

    test('when action handler and unknown option after command-argument then option passed through', (t) => {
      const program = makeProgram();
      const mockAction = t.mock.fn();
      program.action(mockAction);
      program.parse(['arg', '--pass'], { from: 'user' });
      assert.equal(mockAction.mock.callCount(), 1);
      const callArgs = mockAction.mock.calls[0].arguments;
      assert.deepEqual(callArgs[0], ['arg', '--pass']);
    });

    test('when help option (without command-argument) then help called', (t) => {
      const program = makeProgram();
      const mockHelp = t.mock.fn(() => '');

      program.exitOverride().configureHelp({ formatHelp: mockHelp });
      try {
        program.parse(['--help'], { from: 'user' });
      } catch (err) {
        /* empty */
      }
      assert.equal(mockHelp.mock.callCount(), 1);
    });

    test('when help option after command-argument then option passed through', () => {
      const program = makeProgram();
      program.parse(['arg', '--help'], { from: 'user' });
      assert.deepEqual(program.args, ['arg', '--help']);
    });

    test('when version option after command-argument then option passed through', () => {
      const program = makeProgram();
      program.version('1.2.3');
      program.parse(['arg', '--version'], { from: 'user' });
      assert.deepEqual(program.args, ['arg', '--version']);
    });
  });

  // -----------------------------------------------------------

  describe('program with positionalOptions and subcommand', () => {
    function makeProgram() {
      const program = new commander.Command();
      program
        .enablePositionalOptions()
        .option('-s, --shared <value>')
        .argument('<args...>');
      const sub = program
        .command('sub')
        .argument('[arg]')
        .option('-s, --shared <value>')
        .action(() => {}); // Not used, but normal to have action handler on subcommand.
      return { program, sub };
    }

    test('when global option before subcommand then global option parsed', () => {
      const { program } = makeProgram();
      program.parse(['--shared', 'program', 'sub'], { from: 'user' });
      assert.equal(program.opts().shared, 'program');
    });

    test('when shared option after subcommand then parsed by subcommand', () => {
      const { program, sub } = makeProgram();
      program.parse(['sub', '--shared', 'local'], { from: 'user' });
      assert.equal(sub.opts().shared, 'local');
      assert.equal(program.opts().shared, undefined);
    });

    test('when shared option after subcommand argument then parsed by subcommand', () => {
      const { program, sub } = makeProgram();
      program.parse(['sub', 'arg', '--shared', 'local'], { from: 'user' });
      assert.equal(sub.opts().shared, 'local');
      assert.deepEqual(sub.args, ['arg']);
      assert.equal(program.opts().shared, undefined);
    });

    test('when shared option before and after subcommand then both parsed', () => {
      const { program, sub } = makeProgram();
      program.parse(['--shared', 'program', 'sub', '--shared', 'local'], {
        from: 'user',
      });
      assert.equal(program.opts().shared, 'program');
      assert.equal(sub.opts().shared, 'local');
    });

    describe('help', () => {
      const cases = [
        { args: [], programHelp: 1, subHelp: 0 },
        { args: ['sub'], programHelp: 0, subHelp: 0 },
        { args: ['--help'], programHelp: 1, subHelp: 0 },
        { args: ['sub', '--help'], programHelp: 0, subHelp: 1 },
        { args: ['sub', 'foo', '--help'], programHelp: 0, subHelp: 1 },
        { args: ['help'], programHelp: 1, subHelp: 0 },
        { args: ['help', 'sub'], programHelp: 0, subHelp: 1 },
      ];

      for (const { args, programHelp, subHelp } of cases) {
        test(`when user args ${JSON.stringify(args)} then program/sub help called ${programHelp}/${subHelp}`, (t) => {
          const { program, sub } = makeProgram();
          const mockProgramHelp = t.mock.fn();
          program.exitOverride().configureHelp({ formatHelp: mockProgramHelp });
          const mockSubHelp = t.mock.fn();
          sub.exitOverride().configureHelp({ formatHelp: mockSubHelp });

          try {
            program.parse(args, { from: 'user' });
          } catch (err) {
            /* empty */
          }
          assert.equal(mockProgramHelp.mock.callCount(), programHelp);
          assert.equal(mockSubHelp.mock.callCount(), subHelp);
        });
      }
    });
  });

  // ---------------------------------------------------------------

  describe('program with positionalOptions and default subcommand (called sub)', () => {
    function makeProgram() {
      const program = new commander.Command();
      program
        .enablePositionalOptions()
        .option('-s, --shared')
        .option('-g, --global')
        .argument('<args...>');
      const sub = program
        .command('sub', { isDefault: true })
        .argument('[args...]')
        .option('-s, --shared')
        .option('-d, --default')
        .action(() => {}); // Not used, but normal to have action handler on subcommand.
      program.command('another'); // Not used, but normal to have more than one subcommand if have a default.
      return { program, sub };
    }

    test('when program option before sub option then program option read by program', () => {
      const { program } = makeProgram();
      program.parse(['--global', '--default'], { from: 'user' });
      assert.equal(program.opts().global, true);
    });

    test('when program option before sub option then sub option read by sub', () => {
      const { program, sub } = makeProgram();
      program.parse(['--global', '--default'], { from: 'user' });
      assert.equal(sub.opts().default, true);
    });

    test('when shared option before sub argument then option read by program', () => {
      const { program } = makeProgram();
      program.parse(['--shared', 'foo'], { from: 'user' });
      assert.equal(program.opts().shared, true);
    });

    test('when shared option after sub argument then option read by sub', () => {
      const { program, sub } = makeProgram();
      program.parse(['foo', '--shared'], { from: 'user' });
      assert.equal(sub.opts().shared, true);
    });

    describe('help', () => {
      const cases = [
        { args: [], programHelp: 0, subHelp: 0 },
        { args: ['--help'], programHelp: 1, subHelp: 0 },
        { args: ['help'], programHelp: 1, subHelp: 0 },
      ];

      for (const { args, programHelp, subHelp } of cases) {
        test(`when user args ${JSON.stringify(args)} then program/sub help called ${programHelp}/${subHelp}`, (t) => {
          const { program, sub } = makeProgram();
          const mockProgramHelp = t.mock.fn();
          program.exitOverride().configureHelp({ formatHelp: mockProgramHelp });
          const mockSubHelp = t.mock.fn();
          sub.exitOverride().configureHelp({ formatHelp: mockSubHelp });

          try {
            program.parse(args, { from: 'user' });
          } catch (err) {
            /* empty */
          }
          assert.equal(mockProgramHelp.mock.callCount(), programHelp);
          assert.equal(mockSubHelp.mock.callCount(), subHelp);
        });
      }
    });
  });

  // ------------------------------------------------------------------------------

  describe('subcommand with passThrough', () => {
    function makeProgram() {
      const program = new commander.Command();
      program
        .enablePositionalOptions()
        .option('-s, --shared <value>')
        .argument('<args...>');
      const sub = program
        .command('sub')
        .passThroughOptions()
        .argument('[args...]')
        .option('-s, --shared <value>')
        .option('-d, --debug')
        .action(() => {}); // Not used, but normal to have action handler on subcommand.
      return { program, sub };
    }

    test('when option before command-argument then option parsed', () => {
      const { program, sub } = makeProgram();
      program.parse(['sub', '--debug', 'arg'], { from: 'user' });
      assert.deepEqual(sub.args, ['arg']);
      assert.equal(sub.opts().debug, true);
    });

    test('when known option after command-argument then option passed through', () => {
      const { program, sub } = makeProgram();
      program.parse(['sub', 'arg', '--debug'], { from: 'user' });
      assert.deepEqual(sub.args, ['arg', '--debug']);
      assert.equal(sub.opts().debug, undefined);
    });

    test('when unknown option after command-argument then option passed through', () => {
      const { program, sub } = makeProgram();
      program.parse(['sub', 'arg', '--pass'], { from: 'user' });
      assert.deepEqual(sub.args, ['arg', '--pass']);
    });

    test('when action handler and unknown option after command-argument then option passed through', (t) => {
      const { program, sub } = makeProgram();
      const mockAction = t.mock.fn();
      sub.action(mockAction);
      program.parse(['sub', 'arg', '--pass'], { from: 'user' });
      assert.equal(mockAction.mock.callCount(), 1);
      const callArgs = mockAction.mock.calls[0].arguments;
      assert.deepEqual(callArgs[0], ['arg', '--pass']);
    });

    test('when help option after command-argument then option passed through', () => {
      const { program, sub } = makeProgram();
      program.parse(['sub', 'arg', '--help'], { from: 'user' });
      assert.deepEqual(sub.args, ['arg', '--help']);
    });

    test('when version option after command-argument then option passed through', () => {
      const { program, sub } = makeProgram();
      program.version('1.2.3');
      program.parse(['sub', 'arg', '--version'], { from: 'user' });
      assert.deepEqual(sub.args, ['arg', '--version']);
    });

    test('when shared option before sub and after sub and after sub parameter then all three parsed', () => {
      const { program, sub } = makeProgram();
      program.parse(
        ['--shared=global', 'sub', '--shared=local', 'arg', '--shared'],
        { from: 'user' },
      );
      assert.equal(program.opts().shared, 'global');
      assert.equal(sub.opts().shared, 'local');
      assert.deepEqual(sub.args, ['arg', '--shared']);
    });
  });

  // ------------------------------------------------------------------------------

  describe('default command with passThrough', () => {
    function makeProgram() {
      const program = new commander.Command();
      program.enablePositionalOptions();
      const sub = program
        .command('sub', { isDefault: true })
        .passThroughOptions()
        .argument('[args...]')
        .option('-d, --debug')
        .action(() => {}); // Not used, but normal to have action handler on subcommand.
      return { program, sub };
    }

    test('when option before command-argument then option parsed', () => {
      const { program, sub } = makeProgram();
      program.parse(['--debug', 'arg'], { from: 'user' });
      assert.deepEqual(sub.args, ['arg']);
      assert.equal(sub.opts().debug, true);
    });

    test('when known option after command-argument then option passed through', () => {
      const { program, sub } = makeProgram();
      program.parse(['arg', '--debug'], { from: 'user' });
      assert.deepEqual(sub.args, ['arg', '--debug']);
      assert.equal(sub.opts().debug, undefined);
    });

    test('when unknown option after command-argument then option passed through', () => {
      const { program, sub } = makeProgram();
      program.parse(['arg', '--pass'], { from: 'user' });
      assert.deepEqual(sub.args, ['arg', '--pass']);
    });

    test('when action handler and unknown option after command-argument then option passed through', (t) => {
      const { program, sub } = makeProgram();
      const mockAction = t.mock.fn();
      sub.action(mockAction);
      program.parse(['arg', '--pass'], { from: 'user' });
      assert.equal(mockAction.mock.callCount(), 1);
      const callArgs = mockAction.mock.calls[0].arguments;
      assert.deepEqual(callArgs[0], ['arg', '--pass']);
    });
  });

  // ------------------------------------------------------------------------------

  describe('program with action handler and positionalOptions and subcommand', () => {
    function makeProgram() {
      const program = new commander.Command();
      program
        .enablePositionalOptions()
        .option('-g, --global')
        .argument('<args...>')
        .action(() => {});
      const sub = program
        .command('sub')
        .argument('[arg]')
        .action(() => {});
      return { program, sub };
    }

    test('when global option before parameter then global option parsed', () => {
      const { program } = makeProgram();
      program.parse(['--global', 'foo'], { from: 'user' });
      assert.equal(program.opts().global, true);
    });

    test('when global option after parameter then global option parsed', () => {
      const { program } = makeProgram();
      program.parse(['foo', '--global'], { from: 'user' });
      assert.equal(program.opts().global, true);
    });

    test('when global option after parameter with same name as subcommand then global option parsed', () => {
      const { program } = makeProgram();
      program.parse(['foo', 'sub', '--global'], { from: 'user' });
      assert.equal(program.opts().global, true);
    });
  });

  // ------------------------------------------------------------------------------

  describe('broken passThrough', () => {
    test('when program not positional and turn on passThroughOptions in subcommand then error', () => {
      const program = new commander.Command();
      const sub = program.command('sub');

      assert.throws(() => {
        sub.passThroughOptions();
      });
    });

    test('when program not positional and add subcommand with passThroughOptions then error', () => {
      const program = new commander.Command();
      const sub = new commander.Command('sub').passThroughOptions();

      assert.throws(() => {
        program.addCommand(sub);
      });
    });
  });

  // ------------------------------------------------------------------------------

  describe('program with action handler and passThrough and subcommand', () => {
    function makeProgram() {
      const program = new commander.Command();
      program
        .passThroughOptions()
        .option('-g, --global')
        .argument('<args...>')
        .action(() => {});
      const sub = program
        .command('sub')
        .argument('[arg]')
        .option('-g, --group')
        .option('-d, --debug')
        .action(() => {});
      return { program, sub };
    }

    test('when global option before parameter then global option parsed', () => {
      const { program } = makeProgram();
      program.parse(['--global', 'foo'], { from: 'user' });
      assert.equal(program.opts().global, true);
    });

    test('when global option after parameter then passed through', () => {
      const { program } = makeProgram();
      program.parse(['foo', '--global'], { from: 'user' });
      assert.deepEqual(program.args, ['foo', '--global']);
    });

    test('when subcommand option after subcommand then option parsed', () => {
      const { program, sub } = makeProgram();
      program.parse(['sub', '--debug'], { from: 'user' });
      assert.equal(sub.opts().debug, true);
    });

    // This is somewhat of a side-effect of supporting previous test.
    test('when shared option after subcommand then parsed by subcommand', () => {
      const { program, sub } = makeProgram();
      program.parse(['sub', '-g'], { from: 'user' });
      assert.equal(sub.opts().group, true);
      assert.equal(program.opts().global, undefined);
    });
  });

  // ------------------------------------------------------------------------------

  describe('program with allowUnknownOption', () => {
    test('when passThroughOptions and unknown option then arguments from unknown passed through', () => {
      const program = new commander.Command();
      program.passThroughOptions().allowUnknownOption().option('--debug');
      program.argument('[args...]');

      program.parse(['--unknown', '--debug'], { from: 'user' });
      assert.deepEqual(program.args, ['--unknown', '--debug']);
    });

    test('when positionalOptions and unknown option then known options then known option parsed', () => {
      const program = new commander.Command();
      program.enablePositionalOptions().allowUnknownOption().option('--debug');
      program.argument('[args...]');

      program.parse(['--unknown', '--debug'], { from: 'user' });
      assert.equal(program.opts().debug, true);
      assert.deepEqual(program.args, ['--unknown']);
    });
  });

  // ------------------------------------------------------------------------------

  describe('passThroughOptions(xxx) and option after command-argument', () => {
    function makeProgram() {
      const program = new commander.Command();
      program.option('-d, --debug').argument('<args...>');
      return program;
    }

    test('when passThroughOptions() then option passed through', () => {
      const program = makeProgram();
      program.passThroughOptions();
      program.parse(['foo', '--debug'], { from: 'user' });
      assert.deepEqual(program.args, ['foo', '--debug']);
    });

    test('when passThroughOptions(true) then option passed through', () => {
      const program = makeProgram();
      program.passThroughOptions(true);
      program.parse(['foo', '--debug'], { from: 'user' });
      assert.deepEqual(program.args, ['foo', '--debug']);
    });

    test('when passThroughOptions(false) then option parsed', () => {
      const program = makeProgram();
      program.passThroughOptions(false);
      program.parse(['foo', '--debug'], { from: 'user' });
      assert.deepEqual(program.args, ['foo']);
      assert.equal(program.opts().debug, true);
    });
  });

  // ------------------------------------------------------------------------------

  describe('enablePositionalOptions(xxx) and shared option after subcommand', () => {
    function makeProgram() {
      const program = new commander.Command();
      program.option('-d, --debug');
      const sub = program.command('sub').option('-d, --debug');
      return { program, sub };
    }

    test('when enablePositionalOptions() then option parsed by subcommand', () => {
      const { program, sub } = makeProgram();
      program.enablePositionalOptions();
      program.parse(['sub', '--debug'], { from: 'user' });
      assert.equal(sub.opts().debug, true);
    });

    test('when enablePositionalOptions(true) then option parsed by subcommand', () => {
      const { program, sub } = makeProgram();
      program.enablePositionalOptions(true);
      program.parse(['sub', '--debug'], { from: 'user' });
      assert.equal(sub.opts().debug, true);
    });

    test('when enablePositionalOptions(false) then option parsed by program', () => {
      const { program, sub } = makeProgram();
      program.enablePositionalOptions(false);
      program.parse(['sub', '--debug'], { from: 'user' });
      assert.equal(sub.opts().debug, undefined);
      assert.equal(program.opts().debug, true);
    });
  });
});
