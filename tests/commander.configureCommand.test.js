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

// combo:safeOptions

test('when combo:safeOptions then options not stored on command', () => {
  const program = new commander.Command();
  program
    .configureCommand({ combo: 'safeOptions' })
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBeUndefined();
});

test('when combo:safeOptions then options passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .configureCommand({ combo: 'safeOptions' })
    .arguments('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program.opts());
});

test('when combo:safeOptions then options passed to (sub)command action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .configureCommand({ combo: 'safeOptions' });
  const command = program.command('sub')
    .option('--foo <value>', 'description')
    .action(callback);
  program.parse(['node', 'test', 'sub', '--foo', 'bar']);
  expect(callback).toHaveBeenCalledWith(command.opts());
});

// storeOptionsAsProperties

test('when storeOptionsAsProperties:true then options stored on command', () => {
  const program = new commander.Command();
  program
    .configureCommand({ storeOptionsAsProperties: true })
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe('bar');
});

test('when storeOptionsAsProperties:false then options stored on command', () => {
  const program = new commander.Command();
  program
    .configureCommand({ storeOptionsAsProperties: false })
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBeUndefined();
});

test('when combo:safeOptions and storeOptionsAsProperties:true then options stored on command', () => {
  // combo is overruled by specific configuration
  const program = new commander.Command();
  program
    .configureCommand({ combo: 'safeOptions', storeOptionsAsProperties: true })
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe('bar');
});

// passCommandToAction

test('when passCommandToAction:true then command passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .configureCommand({ passCommandToAction: true })
    .arguments('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program);
});

test('when passCommandToAction:false then options passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .configureCommand({ passCommandToAction: false })
    .arguments('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program.opts());
});

test('when combo:safeOptions and passCommandToAction:true then options passed to action', () => {
  // combo is overruled by specific configuration
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .configureCommand({ combo: 'safeOptions', passCommandToAction: true })
    .arguments('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program);
});
