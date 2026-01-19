import { Command, Option } from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test that when option specified twice, second use wins.
// Seems pretty obvious for boolean options, but there was a bug before Commander v9.

describe('last repeated option wins', () => {
  test('when boolean option used twice then value is true', () => {
    const program = new Command();
    program.option('-d, --debug');
    program.parse(['-d', '-d'], { from: 'user' });
    assert.equal(program.opts().debug, true);
  });

  test('when boolean option with default used twice then value is true', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', 'foo');
    program.parse(['-d', '-d'], { from: 'user' });
    assert.equal(program.opts().debug, true);
  });

  test('when boolean option with preset used twice then value is preset', () => {
    const program = new Command();
    program.addOption(new Option('-d, --debug').preset('foo'));
    program.parse(['-d', '-d'], { from: 'user' });
    assert.equal(program.opts().debug, 'foo');
  });

  test('when option with required argument used twice then value is from second use', () => {
    const program = new Command();
    program.option('-p, --port <port-number>');
    program.parse(['-p', '1', '-p', '2'], { from: 'user' });
    assert.equal(program.opts().port, '2');
  });

  test('when option with optional argument used second time without value then value is true', () => {
    const program = new Command();
    program.option('--donate [amount]');
    program.parse(['--donate', '123', '--donate'], { from: 'user' });
    assert.equal(program.opts().donate, true);
  });

  test('when option with optional argument used second time with value then value is from second use', () => {
    const program = new Command();
    program.option('--donate [amount]');
    program.parse(['--donate', '--donate', '123'], { from: 'user' });
    assert.equal(program.opts().donate, '123');
  });
});
