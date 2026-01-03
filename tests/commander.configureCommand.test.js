const commander = require('../');
const { test } = require('node:test');
const assert = require('node:assert/strict');

// Mostly testing direct on program, limited check that (sub)command working same.

// Default behaviours

test('when default then options not stored on command', () => {
  const program = new commander.Command();
  program.option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  assert.equal(program.foo, undefined);
  assert.equal(program.opts().foo, 'bar');
});

test('when default then options+command passed to action', (t) => {
  const program = new commander.Command();
  const callback = t.mock.fn();
  program.argument('<value>').action(callback);
  program.parse(['node', 'test', 'value']);
  const callArgs = callback.mock.calls[0].arguments;
  assert.equal(callArgs[0], 'value');
  assert.equal(callArgs[1], program.opts());
  assert.equal(callArgs[2], program);
});

// storeOptionsAsProperties

test('when storeOptionsAsProperties() then options stored on command', () => {
  const program = new commander.Command();
  program.storeOptionsAsProperties().option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  assert.equal(program.foo, 'bar');
  assert.equal(program.opts().foo, 'bar');
});

test('when storeOptionsAsProperties(true) then options stored on command', () => {
  const program = new commander.Command();
  program.storeOptionsAsProperties(true).option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  assert.equal(program.foo, 'bar');
  assert.equal(program.opts().foo, 'bar');
});

test('when storeOptionsAsProperties(false) then options not stored on command', () => {
  const program = new commander.Command();
  program
    .storeOptionsAsProperties(false)
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  assert.equal(program.foo, undefined);
  assert.equal(program.opts().foo, 'bar');
});

test('when storeOptionsAsProperties() then command+command passed to action', (t) => {
  const program = new commander.Command();
  const callback = t.mock.fn();
  program.storeOptionsAsProperties().argument('<value>').action(callback);
  program.parse(['node', 'test', 'value']);
  const callArgs = callback.mock.calls[0].arguments;
  assert.equal(callArgs[0], 'value');
  assert.equal(callArgs[1], program);
  assert.equal(callArgs[2], program);
});

test('when storeOptionsAsProperties(false) then opts+command passed to action', (t) => {
  const program = new commander.Command();
  const callback = t.mock.fn();
  program.storeOptionsAsProperties(false).argument('<value>').action(callback);
  program.parse(['node', 'test', 'value']);
  const callArgs = callback.mock.calls[0].arguments;
  assert.equal(callArgs[0], 'value');
  assert.equal(callArgs[1], program.opts());
  assert.equal(callArgs[2], program);
});

test('when storeOptionsAsProperties() after adding option then throw', () => {
  const program = new commander.Command();
  program.option('--port <number>', 'port number', '80');
  assert.throws(() => {
    program.storeOptionsAsProperties();
  });
});

test('when storeOptionsAsProperties() after setting option value then throw', () => {
  const program = new commander.Command();
  program.setOptionValue('foo', 'bar');
  assert.throws(() => {
    program.storeOptionsAsProperties();
  });
});
