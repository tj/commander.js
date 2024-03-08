const commander = require('../');

// Test the various ways flags can be specified in the first parameter to `.option`

test('when only short flag defined and not specified then value is undefined', () => {
  const program = new commander.Command();
  program.option('-p', 'add pepper');
  program.parse(['node', 'test']);
  expect(program.opts().p).toBeUndefined();
});

test('when only short flag defined and specified then value is true', () => {
  const program = new commander.Command();
  program.option('-p', 'add pepper');
  program.parse(['node', 'test', '-p']);
  expect(program.opts().p).toBe(true);
});

test('when only long flag defined and not specified then value is undefined', () => {
  const program = new commander.Command();
  program.option('--pepper', 'add pepper');
  program.parse(['node', 'test']);
  expect(program.opts().pepper).toBeUndefined();
});

test('when only long flag defined and specified then value is true', () => {
  const program = new commander.Command();
  program.option('--pepper', 'add pepper');
  program.parse(['node', 'test', '--pepper']);
  expect(program.opts().pepper).toBe(true);
});

test('when "short,long" flags defined and short specified then value is true', () => {
  const program = new commander.Command();
  program.option('-p,--pepper', 'add pepper');
  program.parse(['node', 'test', '-p']);
  expect(program.opts().pepper).toBe(true);
});

test('when "short,long" flags defined and long specified then value is true', () => {
  const program = new commander.Command();
  program.option('-p,--pepper', 'add pepper');
  program.parse(['node', 'test', '--pepper']);
  expect(program.opts().pepper).toBe(true);
});

test('when "short|long" flags defined and short specified then value is true', () => {
  const program = new commander.Command();
  program.option('-p|--pepper', 'add pepper');
  program.parse(['node', 'test', '-p']);
  expect(program.opts().pepper).toBe(true);
});

test('when "short|long" flags defined and long specified then value is true', () => {
  const program = new commander.Command();
  program.option('-p|--pepper', 'add pepper');
  program.parse(['node', 'test', '--pepper']);
  expect(program.opts().pepper).toBe(true);
});

test('when "short long" flags defined and short specified then value is true', () => {
  const program = new commander.Command();
  program.option('-p --pepper', 'add pepper');
  program.parse(['node', 'test', '-p']);
  expect(program.opts().pepper).toBe(true);
});

test('when "short long" flags defined and long specified then value is true', () => {
  const program = new commander.Command();
  program.option('-p --pepper', 'add pepper');
  program.parse(['node', 'test', '--pepper']);
  expect(program.opts().pepper).toBe(true);
});
