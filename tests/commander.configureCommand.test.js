const commander = require('../');

// Mostly testing direct on program, limited check that (sub)command working same.

// Default behaviours

test('when default then options stored on command', () => {
  const program = new commander.Command();
  program
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe('bar');
});

test('when default then command passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .arguments('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program);
});

// storeOptionsAsProperties

test('when storeOptionsAsProperties() then options stored on command', () => {
  const program = new commander.Command();
  program
    .storeOptionsAsProperties()
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe('bar');
});

test('when storeOptionsAsProperties(true) then options stored on command', () => {
  const program = new commander.Command();
  program
    .storeOptionsAsProperties(true)
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe('bar');
});

test('when storeOptionsAsProperties(false) then options not stored on command', () => {
  const program = new commander.Command();
  program
    .storeOptionsAsProperties(false)
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBeUndefined();
});

// passCommandToAction

test('when passCommandToAction() then command passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .passCommandToAction()
    .arguments('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program);
});

test('when passCommandToAction(true) then command passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .passCommandToAction(true)
    .arguments('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program);
});

test('when passCommandToAction(false) then options passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .passCommandToAction(false)
    .arguments('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program.opts());
});
