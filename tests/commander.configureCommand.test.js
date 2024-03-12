const commander = require('../');

// Mostly testing direct on program, limited check that (sub)command working same.

// Default behaviours

test('when default then options not stored on command', () => {
  const program = new commander.Command();
  program.option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBeUndefined();
  expect(program.opts().foo).toBe('bar');
});

test('when default then options+command passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program.argument('<value>').action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program.opts(), program);
});

// storeOptionsAsProperties

test('when storeOptionsAsProperties() then options stored on command', () => {
  const program = new commander.Command();
  program.storeOptionsAsProperties().option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe('bar');
  expect(program.opts().foo).toBe('bar');
});

test('when storeOptionsAsProperties(true) then options stored on command', () => {
  const program = new commander.Command();
  program.storeOptionsAsProperties(true).option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe('bar');
  expect(program.opts().foo).toBe('bar');
});

test('when storeOptionsAsProperties(false) then options not stored on command', () => {
  const program = new commander.Command();
  program
    .storeOptionsAsProperties(false)
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBeUndefined();
  expect(program.opts().foo).toBe('bar');
});

test('when storeOptionsAsProperties() then command+command passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program.storeOptionsAsProperties().argument('<value>').action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program, program);
});

test('when storeOptionsAsProperties(false) then opts+command passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program.storeOptionsAsProperties(false).argument('<value>').action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program.opts(), program);
});

test('when storeOptionsAsProperties() after adding option then throw', () => {
  const program = new commander.Command();
  program.option('--port <number>', 'port number', '80');
  expect(() => {
    program.storeOptionsAsProperties();
  }).toThrow();
});

test('when storeOptionsAsProperties() after setting option value then throw', () => {
  const program = new commander.Command();
  program.setOptionValue('foo', 'bar');
  expect(() => {
    program.storeOptionsAsProperties();
  }).toThrow();
});
