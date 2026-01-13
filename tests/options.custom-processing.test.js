const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  return parseInt(value, 10);
}

function increaseVerbosity(dummyValue, previous) {
  return previous + 1;
}

function collect(value, previous) {
  return previous.concat([value]);
}

function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}

describe('custom processing function for option', () => {
  test('when option not specified then callback not called', (t) => {
    const mockCoercion = t.mock.fn();
    const program = new commander.Command();
    program.option('-i, --integer <n>', 'number', mockCoercion);
    program.parse(['node', 'test']);
    assert.equal(mockCoercion.mock.callCount(), 0);
  });

  test('when option not specified then value is undefined', () => {
    const program = new commander.Command();
    program.option('-i, --integer <n>', 'number', myParseInt);
    program.parse(['node', 'test']);
    assert.equal(program.opts().integer, undefined);
  });

  test('when starting value is defined and option not specified then callback not called', (t) => {
    const mockCoercion = t.mock.fn();
    const program = new commander.Command();
    program.option('-i, --integer <n>', 'number', mockCoercion, 1);
    program.parse(['node', 'test']);
    assert.equal(mockCoercion.mock.callCount(), 0);
  });

  test('when starting value is defined and option not specified then value is starting value', () => {
    // NB: Can not specify a starting value for a boolean flag! Discovered when writing this test...
    const startingValue = 1;
    const program = new commander.Command();
    program.option('-i, --integer <n>', 'number', myParseInt, startingValue);
    program.parse(['node', 'test']);
    assert.equal(program.opts().integer, startingValue);
  });

  test('when option specified then callback called with value and previous', (t) => {
    const mockCoercion = t.mock.fn();
    const value = '1';
    const program = new commander.Command();
    program.option('-i, --integer <n>', 'number', mockCoercion);
    program.parse(['node', 'test', '-i', value]);
    assert.deepEqual(mockCoercion.mock.calls[0].arguments, [value, undefined]);
  });

  test('when option specified then value is as returned from callback', () => {
    const callbackResult = 2;
    const program = new commander.Command();
    program.option('-i, --integer <n>', 'number', () => {
      return callbackResult;
    });
    program.parse(['node', 'test', '-i', '0']);
    assert.equal(program.opts().integer, callbackResult);
  });

  test('when starting value is defined and option specified then callback called with value and starting value', (t) => {
    const mockCoercion = t.mock.fn();
    const startingValue = 1;
    const value = '2';
    const program = new commander.Command();
    program.option('-i, --integer <n>', 'number', mockCoercion, startingValue);
    program.parse(['node', 'test', '-i', value]);
    assert.deepEqual(mockCoercion.mock.calls[0].arguments, [
      value,
      startingValue,
    ]);
  });

  test('when option specified multiple times then callback called with value and previousValue', (t) => {
    const mockCoercion = t.mock.fn(() => 'callback');
    const program = new commander.Command();
    program.option('-i, --integer <n>', 'number', mockCoercion);
    program.parse(['node', 'test', '-i', '1', '-i', '2']);
    assert.equal(mockCoercion.mock.callCount(), 2);
    assert.deepEqual(mockCoercion.mock.calls[0].arguments, ['1', undefined]);
    assert.deepEqual(mockCoercion.mock.calls[1].arguments, ['2', 'callback']);
  });

  // Now some functional tests like the examples in the README!

  test('when parseFloat "1e2" then value is 100', () => {
    const program = new commander.Command();
    program.option('-f, --float <number>', 'float argument', parseFloat);
    program.parse(['node', 'test', '-f', '1e2']);
    assert.equal(program.opts().float, 100);
  });

  test('when myParseInt "1" then value is 1', () => {
    const program = new commander.Command();
    program.option('-i, --integer <number>', 'integer argument', myParseInt);
    program.parse(['node', 'test', '-i', '1']);
    assert.equal(program.opts().integer, 1);
  });

  test('when increaseVerbosity -v -v -v then value is 3', () => {
    const program = new commander.Command();
    program.option(
      '-v, --verbose',
      'verbosity that can be increased',
      increaseVerbosity,
      0,
    );
    program.parse(['node', 'test', '-v', '-v', '-v']);
    assert.equal(program.opts().verbose, 3);
  });

  test('when collect -c a -c b -c c then value is [a, b, c]', () => {
    const program = new commander.Command();
    program.option('-c, --collect <value>', 'repeatable value', collect, []);
    program.parse(['node', 'test', '-c', 'a', '-c', 'b', '-c', 'c']);
    assert.deepEqual(program.opts().collect, ['a', 'b', 'c']);
  });

  test('when commaSeparatedList x,y,z then value is [x, y, z]', () => {
    const program = new commander.Command();
    program.option(
      '-l, --list <items>',
      'comma separated list',
      commaSeparatedList,
    );
    program.parse(['node', 'test', '--list', 'x,y,z']);
    assert.deepEqual(program.opts().list, ['x', 'y', 'z']);
  });
});
