import * as path from 'path';
import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Command.name()', () => {
  test('when construct with name then name is set', () => {
    const program = new commander.Command('foo');
    assert.equal(program.name(), 'foo');
  });

  test('when set program name and parse then name is as assigned', () => {
    const program = new commander.Command();
    program.name('custom');
    program.parse(['node', 'test']);
    assert.equal(program.name(), 'custom');
  });

  test('when program name not set and parse with script argument then plain name is found from script name', () => {
    const program = new commander.Command();
    program.parse(['node', path.resolve(process.cwd(), 'script.js')], {
      from: 'node',
    });
    assert.equal(program.name(), 'script');
  });

  test('when command name not set and no script argument in parse then name is program', () => {
    const program = new commander.Command();
    program.parse([], { from: 'user' });
    assert.equal(program.name(), 'program');
  });

  test('when add command then command is named', () => {
    const program = new commander.Command();
    const subcommand = program.command('mycommand <file>');
    assert.equal(subcommand.name(), 'mycommand');
  });

  test('when set program name then name appears in help', () => {
    const program = new commander.Command();
    program.name('custom-name');
    const helpInformation = program.helpInformation();
    assert.match(helpInformation, /^Usage: custom-name/);
  });

  test('when pass path to nameFromFilename then name is plain name', () => {
    const program = new commander.Command();
    program.nameFromFilename(path.resolve(process.cwd(), 'foo.js'));
    assert.equal(program.name(), 'foo');
  });

  test('when pass import.meta.filename to nameFromFilename then name is plain name of this file', () => {
    const program = new commander.Command();
    program.nameFromFilename(import.meta.filename);
    assert.equal(program.name(), 'command.name.test');
  });
});
