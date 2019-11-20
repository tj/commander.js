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

// modern

test('when modern:true then options not stored on command', () => {
  const program = new commander.Command();
  program
    .configureCommand({ modern: true })
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBeUndefined();
});

test('when modern:true then options passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .configureCommand({ modern: true })
    .arguments('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program.opts());
});

test('when modern:true then options passed to (sub)command action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .configureCommand({ modern: true });
  const command = program.command('sub')
    .option('--foo <value>', 'description')
    .action(callback);
  program.parse(['node', 'test', 'sub', '--foo', 'bar']);
  expect(callback).toHaveBeenCalledWith(command.opts());
});

test('when modern:false then options stored on command', () => {
  const program = new commander.Command();
  program
    .configureCommand({ modern: false })
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe('bar');
});

test('when modern:false then command passed to action', () => {
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .configureCommand({ modern: false })
    .arguments('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program);
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

test('when modern:true and storeOptionsAsProperties:true then options stored on command', () => {
  // modern is overruled by specific configuration
  const program = new commander.Command();
  program
    .configureCommand({ modern: true, storeOptionsAsProperties: true })
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

test('when modern:true and passCommandToAction:true then options passed to action', () => {
  // modern is overruled by specific configuration
  const program = new commander.Command();
  const callback = jest.fn();
  program
    .configureCommand({ modern: true, passCommandToAction: true })
    .arguments('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback).toHaveBeenCalledWith('value', program);
});
