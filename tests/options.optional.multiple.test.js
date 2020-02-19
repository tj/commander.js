const commander = require('../');

// option with multiple optional values, no default
describe('option with multiple optional values, no default', () => {
  test('when option not specified then value is undefined', () => {
    const program = new commander.Command();
    program
      .option('--cheese [type]+', 'cheese type');
    program.parse(['node', 'test']);
    expect(program.cheese).toBeUndefined();
  });

  test('when option specified then value is as specified', () => {
    const program = new commander.Command();
    program
      .option('--cheese [type]+', 'cheese type');
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    expect(program.cheese).toEqual([cheeseType]);
  });

  test('when option specified without value then value is true', () => {
    const program = new commander.Command();
    program
      .option('--cheese [type]+', 'cheese type');
    program.parse(['node', 'test', '--cheese']);
    expect(program.cheese).toEqual([true]);
  });

  test('when option specified without value and following option then value is true', () => {
    // optional options do not eat values with dashes
    const program = new commander.Command();
    program
      .option('--cheese [type]+', 'cheese type')
      .option('--some-option');
    program.parse(['node', 'test', '--cheese', '--some-option']);
    expect(program.cheese).toEqual([true]);
  });
});

// option with multiple optional values, with default
describe('option with multiple optional value, with default', () => {
  test('when option not specified then value is default', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program
      .option('--cheese [type]+', 'cheese type', defaultValue);
    program.parse(['node', 'test']);
    expect(program.cheese).toEqual([defaultValue]);
  });

  test('when option specified then value is as specified', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program
      .option('--cheese [type]+', 'cheese type', defaultValue);
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    expect(program.cheese).toEqual([cheeseType]);
  });

  test('when option specified without value then value is default', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program
      .option('--cheese [type]+', 'cheese type', defaultValue);
    program.parse(['node', 'test', '--cheese']);
    expect(program.cheese).toEqual([defaultValue]);
  });
});
