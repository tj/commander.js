const commander = require('../');

// Test combination of flag and --no-flag
// (single flags tested in options.bool.test.js)

// boolean option combo with no default
describe('boolean option combo with no default', () => {
  function createPepperProgram() {
    const program = new commander.Command();
    program
      .option('-p, --pepper', 'add pepper')
      .option('-P, --no-pepper', 'remove pepper');
    return program;
  }

  test('when boolean combo not specified then value is undefined', () => {
    const program = createPepperProgram();
    program.parse(['node', 'test']);
    expect(program.opts().pepper).toBeUndefined();
  });

  test('when boolean combo positive then value is true', () => {
    const program = createPepperProgram();
    program.parse(['node', 'test', '--pepper']);
    expect(program.opts().pepper).toBe(true);
  });

  test('when boolean combo negative then value is false', () => {
    const program = createPepperProgram();
    program.parse(['node', 'test', '--no-pepper']);
    expect(program.opts().pepper).toBe(false);
  });

  test('when boolean combo last is positive then value is true', () => {
    const program = createPepperProgram();
    program.parse(['node', 'test', '--no-pepper', '--pepper']);
    expect(program.opts().pepper).toBe(true);
  });

  test('when boolean combo last is negative then value is false', () => {
    const program = createPepperProgram();
    program.parse(['node', 'test', '--pepper', '--no-pepper']);
    expect(program.opts().pepper).toBe(false);
  });
});

// Flag with default, say from an environment variable.

function createPepperProgramWithDefault(defaultValue) {
  const program = new commander.Command();
  program
    .option('-p, --pepper', 'add pepper', defaultValue)
    .option('-P, --no-pepper', 'remove pepper');
  return program;
}

// boolean option combo, default true, long flags
describe('boolean option combo, default true, long flags', () => {
  test('when boolean combo not specified then value is true', () => {
    const program = createPepperProgramWithDefault(true);
    program.parse(['node', 'test']);
    expect(program.opts().pepper).toBe(true);
  });

  test('when boolean combo positive then value is true', () => {
    const program = createPepperProgramWithDefault(true);
    program.parse(['node', 'test', '--pepper']);
    expect(program.opts().pepper).toBe(true);
  });

  test('when boolean combo negative then value is false', () => {
    const program = createPepperProgramWithDefault(true);
    program.parse(['node', 'test', '--no-pepper']);
    expect(program.opts().pepper).toBe(false);
  });
});

// boolean option combo, default false, short flags
describe('boolean option combo, default false, short flags', () => {
  test('when boolean combo not specified then value is false', () => {
    const program = createPepperProgramWithDefault(false);
    program.parse(['node', 'test']);
    expect(program.opts().pepper).toBe(false);
  });

  test('when boolean combo positive then value is true', () => {
    const program = createPepperProgramWithDefault(false);
    program.parse(['node', 'test', '-p']);
    expect(program.opts().pepper).toBe(true);
  });

  test('when boolean combo negative then value is false', () => {
    const program = createPepperProgramWithDefault(false);
    program.parse(['node', 'test', '-P']);
    expect(program.opts().pepper).toBe(false);
  });
});

// boolean option combo with non-boolean default.
// Changed behaviour to normal default in Commander 9.
describe('boolean option combo with non-boolean default', () => {
  test('when boolean combo not specified then value is default', () => {
    const program = createPepperProgramWithDefault('default');
    program.parse(['node', 'test']);
    expect(program.opts().pepper).toBe('default');
  });

  test('when boolean combo positive then value is true', () => {
    const program = createPepperProgramWithDefault('default');
    program.parse(['node', 'test', '--pepper']);
    expect(program.opts().pepper).toBe(true);
  });

  test('when boolean combo negative then value is false', () => {
    const program = createPepperProgramWithDefault('default');
    program.parse(['node', 'test', '--no-pepper']);
    expect(program.opts().pepper).toBe(false);
  });
});

describe('boolean option combo with non-boolean default and preset', () => {
  function createPepperProgramWithDefaultAndPreset() {
    const program = new commander.Command();
    program
      .addOption(
        new commander.Option('-p, --pepper')
          .default('default')
          .preset('preset'),
      )
      .option('-P, --no-pepper', 'remove pepper');
    return program;
  }

  test('when boolean combo not specified then value is default', () => {
    const program = createPepperProgramWithDefaultAndPreset();
    program.parse(['node', 'test']);
    expect(program.opts().pepper).toBe('default');
  });

  test('when boolean combo positive then value is preset', () => {
    const program = createPepperProgramWithDefaultAndPreset();
    program.parse(['node', 'test', '--pepper']);
    expect(program.opts().pepper).toBe('preset');
  });

  test('when boolean combo negative then value is false', () => {
    const program = createPepperProgramWithDefaultAndPreset();
    program.parse(['node', 'test', '--no-pepper']);
    expect(program.opts().pepper).toBe(false);
  });
});
