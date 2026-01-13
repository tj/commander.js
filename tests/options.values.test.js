const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Test the ways values can be specified for options.
// See also references on "Utility Conventions" in command.parseOptions.test.js

// options with required values can eat values starting with a dash, including just dash sometimes used as alias for stdin
//
// option with required value, using loop to test all matrix of values and tests
describe('option with required option-argument', () => {
  const valuesList = [['str'], ['80'], ['-'], ['-5'], ['--flag']];

  for (const [value] of valuesList) {
    function createPortProgram() {
      const program = new commander.Command();
      program.option('-p,--port <number>', 'specify port');
      return program;
    }

    test(`when option with required value specified as ${value} and short flag followed by value then value is as specified`, () => {
      const program = createPortProgram();
      program.parse(['node', 'test', '-p', value]);
      assert.equal(program.opts().port, value);
    });

    test(`when option with required value specified as ${value} and short flag concatenated with value then value is as specified`, () => {
      const program = createPortProgram();
      program.parse(['node', 'test', `-p${value}`]);
      assert.equal(program.opts().port, value);
    });

    test(`when option with required value specified as ${value} and long flag followed by value then value is as specified`, () => {
      const program = createPortProgram();
      program.parse(['node', 'test', '--port', value]);
      assert.equal(program.opts().port, value);
    });

    test(`when option with required value specified as ${value} and long flag = value then value is as specified`, () => {
      const program = createPortProgram();
      program.parse(['node', 'test', `--port=${value}`]);
      assert.equal(program.opts().port, value);
    });
  }
});

// option with optional value
describe('option with optional option-argument', () => {
  function createPortProgram() {
    const program = new commander.Command();
    program.option('-p,--port [number]', 'specify port');
    return program;
  }

  test('when short flag followed by value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test -p 80'.split(' '));
    assert.equal(program.opts().port, '80');
  });

  test('when short flag concatenated with value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test -p80'.split(' '));
    assert.equal(program.opts().port, '80');
  });

  test('when long flag followed by value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test --port 80'.split(' '));
    assert.equal(program.opts().port, '80');
  });

  test('when long flag = value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test --port=80'.split(' '));
    assert.equal(program.opts().port, '80');
  });

  test('when long flag followed empty string then value is empty string', () => {
    const program = createPortProgram();
    program.option(
      '-c, --cheese [type]',
      'optionally specify the type of cheese',
    );
    program.parse(['node', 'test', '--cheese', '']);
    assert.equal(program.opts().cheese, '');
  });
});
