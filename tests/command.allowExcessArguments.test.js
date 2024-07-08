const commander = require('../');

// Not testing output, just testing whether an error is detected.

describe.each([true, false])(
  'allowExcessArguments when action handler: %s',
  (hasActionHandler) => {
    function configureCommand(cmd) {
      cmd.exitOverride().configureOutput({
        writeErr: () => {},
      });
      if (hasActionHandler) {
        cmd.action(() => {});
      }
    }

    test('when specify excess program argument then error by default', () => {
      const program = new commander.Command();
      configureCommand(program);

      expect(() => {
        program.parse(['excess'], { from: 'user' });
      }).toThrow();
    });

    test('when specify excess program argument and allowExcessArguments(false) then error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program.allowExcessArguments(false);

      expect(() => {
        program.parse(['excess'], { from: 'user' });
      }).toThrow();
    });

    test('when specify excess program argument and allowExcessArguments() then no error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program.allowExcessArguments();

      expect(() => {
        program.parse(['excess'], { from: 'user' });
      }).not.toThrow();
    });

    test('when specify excess program argument and allowExcessArguments(true) then no error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program.allowExcessArguments(true);

      expect(() => {
        program.parse(['excess'], { from: 'user' });
      }).not.toThrow();
    });

    test('when specify excess command argument then error (by default)', () => {
      const program = new commander.Command();
      const sub = program.command('sub');
      configureCommand(sub);

      expect(() => {
        program.parse(['sub', 'excess'], { from: 'user' });
      }).toThrow();
    });

    test('when specify excess command argument and allowExcessArguments(false) then error', () => {
      const program = new commander.Command();
      const sub = program.command('sub').allowExcessArguments(false);
      configureCommand(sub);

      expect(() => {
        program.parse(['sub', 'excess'], { from: 'user' });
      }).toThrow();
    });

    test('when specify expected arg and allowExcessArguments(false) then no error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program.argument('<file>').allowExcessArguments(false);

      expect(() => {
        program.parse(['file'], { from: 'user' });
      }).not.toThrow();
    });

    test('when specify excess after <arg> and allowExcessArguments(false) then error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program.argument('<file>').allowExcessArguments(false);

      expect(() => {
        program.parse(['file', 'excess'], { from: 'user' });
      }).toThrow();
    });

    test('when specify excess after [arg] and allowExcessArguments(false) then error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program.argument('[file]').allowExcessArguments(false);

      expect(() => {
        program.parse(['file', 'excess'], { from: 'user' });
      }).toThrow();
    });

    test('when specify args for [args...] and allowExcessArguments(false) then no error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program.argument('[files...]').allowExcessArguments(false);

      expect(() => {
        program.parse(['file1', 'file2', 'file3'], { from: 'user' });
      }).not.toThrow();
    });
  },
);
