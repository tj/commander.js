import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('command Usage section in help', () => {
  test('when default usage and check program help then starts with default usage', () => {
    const program = new commander.Command();

    program.name('test');
    const helpInformation = program.helpInformation();

    assert.match(helpInformation, /^Usage: test \[options\]/);
  });

  test('when custom usage and check program help then starts with custom usage', () => {
    const myUsage = 'custom';
    const program = new commander.Command();
    program.usage(myUsage);

    program.name('test');
    const helpInformation = program.helpInformation();

    assert.match(helpInformation, new RegExp(`^Usage: test ${myUsage}`));
  });

  test('when default usage and check subcommand help then starts with default usage including program name', () => {
    const program = new commander.Command();
    const subCommand = program.command('info');

    program.name('test');
    const helpInformation = subCommand.helpInformation();

    assert.match(helpInformation, /^Usage: test info \[options\]/);
  });

  test('when custom usage and check subcommand help then starts with custom usage including program name', () => {
    const myUsage = 'custom';
    const program = new commander.Command();
    const subCommand = program.command('info').usage(myUsage);

    program.name('test');
    const helpInformation = subCommand.helpInformation();

    assert.match(helpInformation, new RegExp(`^Usage: test info ${myUsage}`));
  });

  test('when has option then [options] included in usage', () => {
    const program = new commander.Command();

    program.option('--foo');

    assert.match(program.usage(), /\[options\]/);
  });

  test('when no options then [options] not included in usage', () => {
    const program = new commander.Command();

    program.helpOption(false);

    assert.doesNotMatch(program.usage(), /\[options\]/);
  });

  test('when has command then [command] included in usage', () => {
    const program = new commander.Command();

    program.command('foo');

    assert.match(program.usage(), /\[command\]/);
  });

  test('when no commands then [command] not included in usage', () => {
    const program = new commander.Command();

    assert.doesNotMatch(program.usage(), /\[command\]/);
  });

  test('when argument then argument included in usage', () => {
    const program = new commander.Command();

    program.argument('<file>');

    assert.match(program.usage(), /<file>/);
  });

  test('when options and command and argument then all three included in usage', () => {
    const program = new commander.Command();

    program.argument('<file>').option('--alpha').command('beta');

    assert.equal(program.usage(), '[options] [command] <file>');
  });
});
