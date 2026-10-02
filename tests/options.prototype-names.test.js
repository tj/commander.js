import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { Command } from '../index.js';

describe('option names shared with Object.prototype', () => {
  for (const name of [
    'constructor',
    'toString',
    'hasOwnProperty',
    '__proto__',
  ]) {
    test(`${name} is initially unset`, () => {
      const command = new Command();
      assert.equal(command.getOptionValue(name), undefined);
      assert.equal(command.getOptionValueSource(name), undefined);
    });

    test(`${name} can collect multiple option values`, () => {
      const command = new Command().option(
        `--${name} <value>`,
        'collect values',
        (value, previous = []) => [...previous, value],
      );
      command.parse([`--${name}`, 'one', `--${name}`, 'two'], { from: 'user' });
      assert.deepEqual(command.getOptionValue(name), ['one', 'two']);
      assert.equal(command.getOptionValueSource(name), 'cli');
      assert.equal(Object.getPrototypeOf(command.opts()), Object.prototype);
    });
  }

  test('a prototype-like option survives repeated parsing', () => {
    const command = new Command().option('--__proto__ <value>');
    command.parse(['--__proto__', 'first'], { from: 'user' });
    command.parse(['--__proto__', 'second'], { from: 'user' });
    assert.equal(command.opts().__proto__, 'second');
    assert.equal(command.getOptionValueSource('__proto__'), 'cli');
  });

  test('an inherited value does not satisfy a mandatory option', () => {
    const command = new Command()
      .exitOverride()
      .configureOutput({ writeErr: () => {} })
      .requiredOption('--constructor <name>');
    assert.throws(() => command.parse([], { from: 'user' }), {
      code: 'commander.missingMandatoryOptionValue',
    });
  });

  test('global option merging preserves prototype-like option values', () => {
    const command = new Command().option('--__proto__ <value>');
    const child = command.command('child').option('--local <value>');
    command.parse(['--__proto__', 'global', 'child', '--local', 'local'], {
      from: 'user',
    });
    const options = child.optsWithGlobals();
    assert.equal(options.__proto__, 'global');
    assert.equal(options.local, 'local');
    assert.equal(Object.getPrototypeOf(options), Object.prototype);
    assert.equal(child.getOptionValueSourceWithGlobals('__proto__'), 'cli');
  });
});
