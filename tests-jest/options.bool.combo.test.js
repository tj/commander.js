const commander = require('../');

// Test combination of flag and --no-flag
// (single flags tested in options.bool.test.js)

describe('boolean option combo with no default', () => {
  function createFlagProgram() {
    const program = new commander.Command();
    program
      .option('-p, --pepper', 'add pepper')
      .option('-P, --no-pepper', 'remove pepper');
    return program;
  }

  test('when boolean combo not specified then value is undefined', () => {
    const program = createFlagProgram();
    program.parse(['node', 'test']);
    expect(program.pepper).toBeUndefined();
  });

  test('when boolean combo positive then value is true', () => {
    const program = createFlagProgram();
    program.parse(['node', 'test', '--pepper']);
    expect(program.pepper).toBe(true);
  });

  test('when boolean combo negative then value is false', () => {
    const program = createFlagProgram();
    program.parse(['node', 'test', '--no-pepper']);
    expect(program.pepper).toBe(false);
  });

  test('when boolean combo last is positive then value is true', () => {
    const program = createFlagProgram();
    program.parse(['node', 'test', '--no-pepper', '--pepper']);
    expect(program.pepper).toBe(true);
  });

  test('when boolean combo last is negative then value is false', () => {
    const program = createFlagProgram();
    program.parse(['node', 'test', '--pepper', '--no-pepper']);
    expect(program.pepper).toBe(false);
  });
});

// Flag with default, say from an environment variable.

function createFlagProgramWithDefault(defaultValue) {
  const program = new commander.Command();
  program
    .option('-p, --pepper', 'add pepper', defaultValue)
    .option('-P, --no-pepper', 'remove pepper');
  return program;
}

describe('boolean option combo, default true, long flags', () => {
  test('when boolean combo not specified then value is true', () => {
    const program = createFlagProgramWithDefault(true);
    program.parse(['node', 'test']);
    expect(program.pepper).toBe(true);
  });

  test('when boolean combo positive then value is true', () => {
    const program = createFlagProgramWithDefault(true);
    program.parse(['node', 'test', '--pepper']);
    expect(program.pepper).toBe(true);
  });

  test('when boolean combo negative then value is false', () => {
    const program = createFlagProgramWithDefault(true);
    program.parse(['node', 'test', '--no-pepper']);
    expect(program.pepper).toBe(false);
  });
});

describe('boolean option combo, default false, short flags', () => {
  test('when boolean combo not specified then value is false', () => {
    const program = createFlagProgramWithDefault(false);
    program.parse(['node', 'test']);
    expect(program.pepper).toBe(false);
  });

  test('when boolean combo positive then value is true', () => {
    const program = createFlagProgramWithDefault(false);
    program.parse(['node', 'test', '-p']);
    expect(program.pepper).toBe(true);
  });

  test('when boolean combo negative then value is false', () => {
    const program = createFlagProgramWithDefault(false);
    program.parse(['node', 'test', '-P']);
    expect(program.pepper).toBe(false);
  });
});
