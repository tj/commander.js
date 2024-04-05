const commander = require('../');

// Test the ways values can be specified for options.
// See also references on "Utility Conventions" in command.parseOptions.test.js

// options with required values can eat values starting with a dash, including just dash sometimes used as alias for stdin
//
// option with required value, using describe.each to test all matrix of values and tests
describe.each([['str'], ['80'], ['-'], ['-5'], ['--flag']])(
  'option with required value specified as %s',
  (value) => {
    function createPortProgram() {
      const program = new commander.Command();
      program.option('-p,--port <number>', 'specify port');
      return program;
    }

    test('when short flag followed by value then value is as specified', () => {
      const program = createPortProgram();
      program.parse(['node', 'test', '-p', value]);
      expect(program.opts().port).toBe(value);
    });

    test('when short flag concatenated with value then value is as specified', () => {
      const program = createPortProgram();
      program.parse(['node', 'test', `-p${value}`]);
      expect(program.opts().port).toBe(value);
    });

    test('when long flag followed by value then value is as specified', () => {
      const program = createPortProgram();
      program.parse(['node', 'test', '--port', value]);
      expect(program.opts().port).toBe(value);
    });

    test('when long flag = value then value is as specified', () => {
      const program = createPortProgram();
      program.parse(['node', 'test', `--port=${value}`]);
      expect(program.opts().port).toBe(value);
    });
  },
);

// option with optional value
describe('option with optional value', () => {
  function createPortProgram() {
    const program = new commander.Command();
    program.option('-p,--port [number]', 'specify port');
    return program;
  }

  test('when short flag followed by value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test -p 80'.split(' '));
    expect(program.opts().port).toBe('80');
  });

  test('when short flag concatenated with value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test -p80'.split(' '));
    expect(program.opts().port).toBe('80');
  });

  test('when long flag followed by value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test --port 80'.split(' '));
    expect(program.opts().port).toBe('80');
  });

  test('when long flag = value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test --port=80'.split(' '));
    expect(program.opts().port).toBe('80');
  });

  test('when long flag followed empty string then value is empty string', () => {
    const program = createPortProgram();
    program.option(
      '-c, --cheese [type]',
      'optionally specify the type of cheese',
    );
    program.parse(['node', 'test', '--cheese', '']);
    expect(program.opts().cheese).toBe('');
  });
});
