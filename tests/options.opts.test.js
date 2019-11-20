const commander = require('../');

// Test the `.opts()` way of accesing option values.
// Basic coverage of the main option types (leaving out negatable flags and options with optional values).

test('when .version used then version in opts', () => {
  const program = new commander.Command();
  const version = '0.0.1';
  program
    .version(version);
  program.parse(['node', 'test']);
  expect(program.opts()).toEqual({ version });
});

test('when .version used with modern then version not in opts', () => {
  const program = new commander.Command();
  const version = '0.0.1';
  program
    .configureCommand({ modern: true })
    .version(version);
  program.parse(['node', 'test']);
  expect(program.opts()).toEqual({ });
});

describe.each([true, false])('using modern is %s', (useModern) => {
  test('when boolean flag not specified then not in opts', () => {
    const program = new commander.Command();
    if (useModern) {
      program.configureCommand({ modern: true });
    }
    program
      .option('--pepper', 'add pepper');
    program.parse(['node', 'test']);
    expect(program.opts()).toEqual({ });
  });

  test('when boolean flag specified then value true', () => {
    const program = new commander.Command();
    if (useModern) {
      program.configureCommand({ modern: true });
    }
    program
      .option('--pepper', 'add pepper');
    program.parse(['node', 'test', '--pepper']);
    expect(program.opts()).toEqual({ pepper: true });
  });

  test('when option with required value not specified then not in opts', () => {
    const program = new commander.Command();
    if (useModern) {
      program.configureCommand({ modern: true });
    }
    program
      .option('--pepper <flavour>', 'add pepper');
    program.parse(['node', 'test']);
    expect(program.opts()).toEqual({ });
  });

  test('when option with required value specified then value as specified', () => {
    const pepperValue = 'red';
    const program = new commander.Command();
    if (useModern) {
      program.configureCommand({ modern: true });
    }
    program
      .option('--pepper <flavour>', 'add pepper');
    program.parse(['node', 'test', '--pepper', pepperValue]);
    expect(program.opts()).toEqual({ pepper: pepperValue });
  });

  test('when option with default value not specified then default value in opts', () => {
    const pepperDefault = 'red';
    const program = new commander.Command();
    if (useModern) {
      program.configureCommand({ modern: true });
    }
    program
      .option('--pepper <flavour>', 'add pepper', pepperDefault);
    program.parse(['node', 'test']);
    expect(program.opts()).toEqual({ pepper: pepperDefault });
  });
});
