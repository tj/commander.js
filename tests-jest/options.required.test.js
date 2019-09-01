const commander = require('../');

// option with required value, no default
describe('option with required value, no default', () => {
  test('when option not specified then value is undefined', () => {
    const program = new commander.Command();
    program
      .option('--cheese <type>', 'cheese type');
    program.parse(['node', 'test']);
    expect(program.cheese).toBeUndefined();
  });

  test('when option specified then value is as specified', () => {
    const program = new commander.Command();
    program
      .option('--cheese <type>', 'cheese type');
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    expect(program.cheese).toBe(cheeseType);
  });

  test('when option specified as dash then value is dash', () => {
    // required options eat values even with dashes
    const program = new commander.Command();
    program
      .option('--output <file>', 'output');
    const dash = '-';
    program.parse(['node', 'test', '--output', dash]);
    expect(program.output).toBe(dash);
  });

  test('when option value specified with leading dashes then value is as specified', () => {
    // required options eat values even with dashes
    const program = new commander.Command();
    program
      .option('--warning-flags <flags>', 'options for another command');
    const warningFlags = '--failOnWarning';
    program.parse(['node', 'test', '--warning-flags', warningFlags]);
    expect(program.warningFlags).toBe(warningFlags);
  });

  test('when option value not specified then error', () => {
    // Arrange. Mock error routine to allow interception.
    const spyOptionMissingArgument = jest.fn(() => {
      throw new Error('optionMissingArgument');
    });
    const program = new commander.Command();
    program.optionMissingArgument = spyOptionMissingArgument;
    program
      .option('--cheese <type>', 'cheese type');

    // Act. The throw is due to the above mock, and not default behaviour.
    expect(() => {
      program.parse(['node', 'test', '--cheese']);
    }).toThrow();

    // Assert
    expect(spyOptionMissingArgument).toHaveBeenCalled();
  });
});

// option with required value, with default
describe('option with required value, with default', () => {
  test('when option not specified then value is default', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program
      .option('--cheese <type>', 'cheese type', defaultValue);
    program.parse(['node', 'test']);
    expect(program.cheese).toBe(defaultValue);
  });

  test('when option specified then value is as specified', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program
      .option('--cheese <type>', 'cheese type', defaultValue);
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    expect(program.cheese).toBe(cheeseType);
  });

  test('when option value not specified then error', () => {
    // Arrange. Mock error routine to allow interception.
    const spyOptionMissingArgument = jest.fn(() => {
      throw new Error('optionMissingArgument');
    });
    const defaultValue = 'default';
    const program = new commander.Command();
    program.optionMissingArgument = spyOptionMissingArgument;
    program
      .option('--cheese <type>', 'cheese type', defaultValue);

    // Act. The throw is due to the above mock, and not default behaviour.
    expect(() => {
      program.parse(['node', 'test', '--cheese']);
    }).toThrow();

    // Assert
    expect(spyOptionMissingArgument).toHaveBeenCalled();
  });
});
