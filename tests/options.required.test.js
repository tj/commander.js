const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

function makeQuietProgram() {
  const program = new commander.Command();
  program.exitOverride();
  program.configureOutput({
    writeErr: () => {},
  });
  return program;
}

// option with required value, no default
describe('option with required value, no default', () => {
  test('when option not specified then value is undefined', () => {
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type');
    program.parse(['node', 'test']);
    assert.equal(program.opts().cheese, undefined);
  });

  test('when option specified then value is as specified', () => {
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type');
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    assert.equal(program.opts().cheese, cheeseType);
  });

  test('when option value not specified then error', () => {
    const program = makeQuietProgram();
    program.option('--cheese <type>', 'cheese type');

    // Act. The throw is due to the above mock, and not default behaviour.
    assert.throws(
      () => {
        program.parse(['node', 'test', '--cheese']);
      },
      {
        code: 'commander.optionMissingArgument',
      },
    );
  });
});

// option with required value, with default
describe('option with required value, with default', () => {
  test('when option not specified then value is default', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type', defaultValue);
    program.parse(['node', 'test']);
    assert.equal(program.opts().cheese, defaultValue);
  });

  test('when option specified then value is as specified', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type', defaultValue);
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    assert.equal(program.opts().cheese, cheeseType);
  });

  test('when option value not specified then error', (t) => {
    const defaultValue = 'default';
    const program = makeQuietProgram();
    program.option('--cheese <type>', 'cheese type', defaultValue);

    assert.throws(
      () => {
        program.parse(['node', 'test', '--cheese']);
      },
      { code: 'commander.optionMissingArgument' },
    );
  });
});
