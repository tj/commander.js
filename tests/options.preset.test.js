const { Command, Option } = require('../');
const { test } = require('node:test');
const assert = require('node:assert/strict');

test('when boolean option with string preset used then value is preset', () => {
  const program = new Command();
  program.addOption(new Option('-d, --debug').preset('foo'));
  program.parse(['-d'], { from: 'user' });
  assert.equal(program.opts().debug, 'foo');
});

test('when boolean option with number preset used then value is preset', () => {
  const program = new Command();
  program.addOption(new Option('-d, --debug').preset(80));
  program.parse(['-d'], { from: 'user' });
  assert.equal(program.opts().debug, 80);
});

test('when optional with string preset used then value is preset', () => {
  const program = new Command();
  program.addOption(new Option('-p, --port [port]').preset('foo'));
  program.parse(['-p'], { from: 'user' });
  assert.equal(program.opts().port, 'foo');
});

test('when optional with number preset used then value is preset', () => {
  const program = new Command();
  program.addOption(new Option('-p, --port [port]').preset(80));
  program.parse(['-p'], { from: 'user' });
  assert.equal(program.opts().port, 80);
});

test('when optional with string preset used with option-argument then value is as specified', () => {
  const program = new Command();
  program.addOption(new Option('-p, --port [port]').preset('foo'));
  program.parse(['-p', '1234'], { from: 'user' });
  assert.equal(program.opts().port, '1234');
});

test('when optional with preset and coerce used then preset is coerced', () => {
  const program = new Command();
  program.addOption(
    new Option('-p, --port [port]').preset('4').argParser(parseFloat),
  );
  program.parse(['-p'], { from: 'user' });
  assert.equal(program.opts().port, 4);
});

test('when optional with preset and variadic used then preset is concatenated', () => {
  const program = new Command();
  program.addOption(new Option('-n, --name [name...]').preset('two'));
  program.parse(['-n', 'one', '-n', '-n', 'three'], { from: 'user' });
  assert.deepEqual(program.opts().name, ['one', 'two', 'three']);
});

test('when negated with string preset used then value is preset', () => {
  const program = new Command();
  program.addOption(new Option('--no-colour').preset('foo'));
  program.parse(['--no-colour'], { from: 'user' });
  assert.equal(program.opts().colour, 'foo');
});
