const commander = require('../');

// Test the `.opts()` way of accessing option values.
// Basic coverage of the main option types (leaving out negatable flags and options with optional values).

test('when .version used with storeOptionsAsProperties() then version in opts', () => {
  const program = new commander.Command();
  const version = '0.0.1';
  program
    .storeOptionsAsProperties()
    .version(version);
  program.parse(['node', 'test']);
  expect(program.opts()).toEqual({ version });
});

test('when .version used with storeOptionsAsProperties(false) then version not in opts', () => {
  // New behaviour, stop storing version as an option value.
  const program = new commander.Command();
  const version = '0.0.1';
  program
    .storeOptionsAsProperties(false)
    .version(version);
  program.parse(['node', 'test']);
  expect(program.opts()).toEqual({ });
});

describe.each([true, false])('storeOptionsAsProperties is %s', (storeOptionsAsProperties) => {
  test('when boolean flag not specified then not in opts', () => {
    const program = new commander.Command();
    program.storeOptionsAsProperties(storeOptionsAsProperties);
    program
      .option('--pepper', 'add pepper');
    program.parse(['node', 'test']);
    expect(program.opts()).toEqual({ });
  });

  test('when boolean flag specified then value true', () => {
    const program = new commander.Command();
    program.storeOptionsAsProperties(storeOptionsAsProperties);
    program
      .option('--pepper', 'add pepper');
    program.parse(['node', 'test', '--pepper']);
    expect(program.opts()).toEqual({ pepper: true });
  });

  test('when option with required value not specified then not in opts', () => {
    const program = new commander.Command();
    program.storeOptionsAsProperties(storeOptionsAsProperties);
    program
      .option('--pepper <flavour>', 'add pepper');
    program.parse(['node', 'test']);
    expect(program.opts()).toEqual({ });
  });

  test('when option with required value specified then value as specified', () => {
    const pepperValue = 'red';
    const program = new commander.Command();
    program.storeOptionsAsProperties(storeOptionsAsProperties);
    program
      .option('--pepper <flavour>', 'add pepper');
    program.parse(['node', 'test', '--pepper', pepperValue]);
    expect(program.opts()).toEqual({ pepper: pepperValue });
  });

  test('when option with default value not specified then default value in opts', () => {
    const pepperDefault = 'red';
    const program = new commander.Command();
    program.storeOptionsAsProperties(storeOptionsAsProperties);
    program
      .option('--pepper <flavour>', 'add pepper', pepperDefault);
    program.parse(['node', 'test']);
    expect(program.opts()).toEqual({ pepper: pepperDefault });
  });
});
