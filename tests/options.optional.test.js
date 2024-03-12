const commander = require('../');

// option with optional value, no default
describe('option with optional value, no default', () => {
  test('when option not specified then value is undefined', () => {
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type');
    program.parse(['node', 'test']);
    expect(program.opts().cheese).toBeUndefined();
  });

  test('when option specified then value is as specified', () => {
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type');
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    expect(program.opts().cheese).toBe(cheeseType);
  });

  test('when option specified without value then value is true', () => {
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type');
    program.parse(['node', 'test', '--cheese']);
    expect(program.opts().cheese).toBe(true);
  });

  test('when option specified without value and following option then value is true', () => {
    // optional options do not eat values with dashes
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type').option('--some-option');
    program.parse(['node', 'test', '--cheese', '--some-option']);
    expect(program.opts().cheese).toBe(true);
  });
});

// option with optional value, with default
describe('option with optional value, with default', () => {
  test('when option not specified then value is default', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type', defaultValue);
    program.parse(['node', 'test']);
    expect(program.opts().cheese).toBe(defaultValue);
  });

  test('when option specified then value is as specified', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type', defaultValue);
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    expect(program.opts().cheese).toBe(cheeseType);
  });

  test('when option specified without value then value is true', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type', defaultValue);
    program.parse(['node', 'test', '--cheese']);
    expect(program.opts().cheese).toBe(true);
  });

  test('when option specified without value and preset then value is preset', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('--cheese [type]').preset('preset'));
    program.parse(['node', 'test', '--cheese']);
    expect(program.opts().cheese).toBe('preset');
  });
});
