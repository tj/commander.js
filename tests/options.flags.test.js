const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Test the various ways flags can be specified in the first parameter to `.option`

describe('option parsing', () => {
  test('when only short flag defined and not specified then value is undefined', () => {
    const program = new commander.Command();
    program.option('-p', 'add pepper');
    program.parse(['node', 'test']);
    assert.equal(program.opts().p, undefined);
  });

  test('when only short flag defined and specified then value is true', () => {
    const program = new commander.Command();
    program.option('-p', 'add pepper');
    program.parse(['node', 'test', '-p']);
    assert.equal(program.opts().p, true);
  });

  test('when only long flag defined and not specified then value is undefined', () => {
    const program = new commander.Command();
    program.option('--pepper', 'add pepper');
    program.parse(['node', 'test']);
    assert.equal(program.opts().pepper, undefined);
  });

  test('when only long flag defined and specified then value is true', () => {
    const program = new commander.Command();
    program.option('--pepper', 'add pepper');
    program.parse(['node', 'test', '--pepper']);
    assert.equal(program.opts().pepper, true);
  });

  test('when "short,long" flags defined and short specified then value is true', () => {
    const program = new commander.Command();
    program.option('-p,--pepper', 'add pepper');
    program.parse(['node', 'test', '-p']);
    assert.equal(program.opts().pepper, true);
  });

  test('when "short,long" flags defined and long specified then value is true', () => {
    const program = new commander.Command();
    program.option('-p,--pepper', 'add pepper');
    program.parse(['node', 'test', '--pepper']);
    assert.equal(program.opts().pepper, true);
  });

  test('when "short|long" flags defined and short specified then value is true', () => {
    const program = new commander.Command();
    program.option('-p|--pepper', 'add pepper');
    program.parse(['node', 'test', '-p']);
    assert.equal(program.opts().pepper, true);
  });

  test('when "short|long" flags defined and long specified then value is true', () => {
    const program = new commander.Command();
    program.option('-p|--pepper', 'add pepper');
    program.parse(['node', 'test', '--pepper']);
    assert.equal(program.opts().pepper, true);
  });

  test('when "short long" flags defined and short specified then value is true', () => {
    const program = new commander.Command();
    program.option('-p --pepper', 'add pepper');
    program.parse(['node', 'test', '-p']);
    assert.equal(program.opts().pepper, true);
  });

  test('when "short long" flags defined and long specified then value is true', () => {
    const program = new commander.Command();
    program.option('-p --pepper', 'add pepper');
    program.parse(['node', 'test', '--pepper']);
    assert.equal(program.opts().pepper, true);
  });
});
