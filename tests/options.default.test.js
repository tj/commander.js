const { Command, Option } = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('.option() with default and option not specified in parse', () => {
  test('when boolean option with boolean default then value is default', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', false);
    program.parse([], { from: 'user' });
    assert.equal(program.opts().debug, false);
  });

  test('when boolean option with number zero default then value is zero', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', 0);
    program.parse([], { from: 'user' });
    assert.equal(program.opts().debug, 0);
  });

  test('when boolean option with string default then value is default', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', 'default');
    program.parse([], { from: 'user' });
    assert.equal(program.opts().debug, 'default');
  });

  test('when required option-argument and default number then value is default', () => {
    const program = new Command();
    program.option('-p, --port <port-number>', 'description', 80);
    program.parse([], { from: 'user' });
    assert.equal(program.opts().port, 80);
  });

  test('when required option-argument and default string then value is default', () => {
    const program = new Command();
    program.option('-p, --port <port-number>', 'description', 'foo');
    program.parse([], { from: 'user' });
    assert.equal(program.opts().port, 'foo');
  });

  test('when optional option-argument and default number then value is default', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 80);
    program.parse([], { from: 'user' });
    assert.equal(program.opts().port, 80);
  });

  test('when optional option-argument and default string then value is default', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 'foo');
    program.parse([], { from: 'user' });
    assert.equal(program.opts().port, 'foo');
  });

  test('when negated and default string then value is default', () => {
    // Bit tricky thinking about what default means for a negated option, but treat as with other options.
    const program = new Command();
    program.option('--no-colour', 'description', 'RGB');
    program.parse([], { from: 'user' });
    assert.equal(program.opts().colour, 'RGB');
  });
});

describe('Option with default and option not specified in parse', () => {
  test('when boolean option with boolean default then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-d, --debug').default(false));
    program.parse([], { from: 'user' });
    assert.equal(program.opts().debug, false);
  });

  test('when boolean option with number zero default then value is zero', () => {
    const program = new Command();
    program.addOption(new Option('-d, --debug').default(0));
    program.parse([], { from: 'user' });
    assert.equal(program.opts().debug, 0);
  });

  test('when boolean option with string default then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-d, --debug').default('default'));
    program.parse([], { from: 'user' });
    assert.equal(program.opts().debug, 'default');
  });

  test('when required option-argument and default number then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-p, --port <port-number>').default(80));
    program.parse([], { from: 'user' });
    assert.equal(program.opts().port, 80);
  });

  test('when required option-argument and default string then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-p, --port <port-number>').default('foo'));
    program.parse([], { from: 'user' });
    assert.equal(program.opts().port, 'foo');
  });

  test('when optional option-argument and default number then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-p, --port [port-number]').default(80));
    program.parse([], { from: 'user' });
    assert.equal(program.opts().port, 80);
  });

  test('when optional option-argument and default string then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-p, --port [port-number]').default('foo'));
    program.parse([], { from: 'user' });
    assert.equal(program.opts().port, 'foo');
  });

  test('when negated and default string then value is default', () => {
    // Bit tricky thinking about what default means for a negated option, but treat as with other options.
    const program = new Command();
    program.addOption(new Option('--no-colour').default('RGB'));
    program.parse([], { from: 'user' });
    assert.equal(program.opts().colour, 'RGB');
  });
});

// Fairly obvious this needs to happen, but was broken for optional in past!
describe('default overwritten by specified option', () => {
  test('when boolean option with boolean default then value is true', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', false);
    program.parse(['-d'], { from: 'user' });
    assert.equal(program.opts().debug, true);
  });

  test('when boolean option with number zero default then value is true', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', 0);
    program.parse(['-d'], { from: 'user' });
    assert.equal(program.opts().debug, true);
  });

  test('when boolean option with string default then value is true', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', 'default');
    program.parse(['-d'], { from: 'user' });
    assert.equal(program.opts().debug, true);
  });

  test('when required option-argument and default number then value is from args', () => {
    const program = new Command();
    program.option('-p, --port <port-number>', 'description', 80);
    program.parse(['-p', '1234'], { from: 'user' });
    assert.equal(program.opts().port, '1234');
  });

  test('when required option-argument and default string then value is from args', () => {
    const program = new Command();
    program.option('-p, --port <port-number>', 'description', 'foo');
    program.parse(['-p', '1234'], { from: 'user' });
    assert.equal(program.opts().port, '1234');
  });

  test('when optional option-argument and default number and option-argument specified then value is from args', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 80);
    program.parse(['-p', '1234'], { from: 'user' });
    assert.equal(program.opts().port, '1234');
  });

  test('when optional option-argument and default string and option-argument specified then value is from args', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 'foo');
    program.parse(['-p', '1234'], { from: 'user' });
    assert.equal(program.opts().port, '1234');
  });

  test('when optional option-argument and default number and option-argument not specified then value is true', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 80);
    program.parse(['-p'], { from: 'user' });
    assert.equal(program.opts().port, true);
  });

  test('when optional option-argument and default string and option-argument not specified then value is true', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 'foo');
    program.parse(['-p'], { from: 'user' });
    assert.equal(program.opts().port, true);
  });

  test('when negated and default string then value is false', () => {
    // Bit tricky thinking about what default means for a negated option, but treat as with other options.
    const program = new Command();
    program.option('--no-colour', 'description', 'RGB');
    program.parse(['--no-colour'], { from: 'user' });
    assert.equal(program.opts().colour, false);
  });
});
