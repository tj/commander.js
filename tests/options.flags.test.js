const commander = require('../');

// Test the various ways flags can be specified in the first parameter to `.option`

test('when only short flag defined and specified then value is true', () => {
  const program = new commander.Command();
  program
    .option('-p', 'add pepper');
  program.parse(['node', 'test', '-p']);
  expect(program.P).toBe(true);
});

// Sanity check that pepper is not true normally, as otherwise all the following tests would pass for the wrong reasons!
test('when only long flag defined and not specified then value is undefined', () => {
  const program = new commander.Command();
  program
    .option('--pepper', 'add pepper');
  program.parse(['node', 'test']);
  expect(program.pepper).toBeUndefined();
});

test('when only long flag defined and specified then value is true', () => {
  const program = new commander.Command();
  program
    .option('--pepper', 'add pepper');
  program.parse(['node', 'test', '--pepper']);
  expect(program.pepper).toBe(true);
});

test('when "short,long" flags defined and short specified then value is true', () => {
  const program = new commander.Command();
  program
    .option('-p,--pepper', 'add pepper');
  program.parse(['node', 'test', '-p']);
  expect(program.pepper).toBe(true);
});

test('when "short,long" flags defined and long specified then value is true', () => {
  const program = new commander.Command();
  program
    .option('-p,--pepper', 'add pepper');
  program.parse(['node', 'test', '--pepper']);
  expect(program.pepper).toBe(true);
});

test('when "short|long" flags defined and short specified then value is true', () => {
  const program = new commander.Command();
  program
    .option('-p|--pepper', 'add pepper');
  program.parse(['node', 'test', '-p']);
  expect(program.pepper).toBe(true);
});

test('when "short|long" flags defined and long specified then value is true', () => {
  const program = new commander.Command();
  program
    .option('-p|--pepper', 'add pepper');
  program.parse(['node', 'test', '--pepper']);
  expect(program.pepper).toBe(true);
});

test('when "short long" flags defined and short specified then value is true', () => {
  const program = new commander.Command();
  program
    .option('-p --pepper', 'add pepper');
  program.parse(['node', 'test', '-p']);
  expect(program.pepper).toBe(true);
});

test('when "short long" flags defined and long specified then value is true', () => {
  const program = new commander.Command();
  program
    .option('-p --pepper', 'add pepper');
  program.parse(['node', 'test', '--pepper']);
  expect(program.pepper).toBe(true);
});

const envBoolCoercion = (val, prior) => {
  if (val !== undefined) {
    return [true, 1, 'true', 't', 'yes', 'y', 'on'].indexOf(
      typeof val === 'string' ? val.toLowerCase() : val
    ) >= 0;
  }
  return !prior;
};

test('when "short,env" flags defined and short specified then value is true', () => {
  // it is questionable for a boolean flag to be defined by the env given
  // commander's toggle behavior when flags are defined multiple times.
  process.env.PEPPER = 'false';
  const program = new commander.Command();
  program
    .option('-p,env:PEPPER', 'add pepper', envBoolCoercion);
  program.parse(['node', 'test', '-p']);
  process.env.PEPPER = undefined;
  expect(program.P).toBe(true);
});

test('when "short,env" flags defined and env specified then value is true', () => {
  // only works because flag isn't set on command line
  process.env.PEPPER = 'true';
  const program = new commander.Command();
  program
    .option('-p,env:PEPPER', 'add pepper', envBoolCoercion);
  program.parse(['node', 'test']);
  process.env.PEPPER = undefined;
  expect(program.P).toBe(true);
});

test('when "short,long,env" flags defined and env specified then value is true', () => {
// only works because flag isn't set on command line
  process.env.PEPPER = 'true';
  const program = new commander.Command();
  program
    .option('-p,--pepper,env:PEPPER', 'add pepper', envBoolCoercion);
  program.parse(['node', 'test']);
  process.env.PEPPER = undefined;
  expect(program.pepper).toBe(true);
});
