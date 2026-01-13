const { Command } = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('registering clashing subcommands', () => {
  test('when command name conflicts with existing name then throw', () => {
    assert.throws(
      () => {
        const program = new Command();
        program.command('one');
        program.command('one');
      },
      { message: /cannot add command/ },
    );
  });

  test('when command name conflicts with existing alias then throw', () => {
    assert.throws(
      () => {
        const program = new Command();
        program.command('one').alias('1');
        program.command('1');
      },
      { message: /cannot add command/ },
    );
  });

  test('when command alias conflicts with existing name then throw', () => {
    assert.throws(
      () => {
        const program = new Command();
        program.command('one');
        program.command('1').alias('one');
      },
      { message: /cannot add alias/ },
    );
  });

  test('when command alias conflicts with existing alias then throw', () => {
    assert.throws(
      () => {
        const program = new Command();
        program.command('one').alias('1');
        program.command('unity').alias('1');
      },
      { message: /cannot add alias/ },
    );
  });

  test('when .addCommand name conflicts with existing name then throw', () => {
    assert.throws(
      () => {
        const program = new Command();
        program.command('one');
        program.addCommand(new Command('one'));
      },
      { message: /cannot add command/ },
    );
  });

  test('when .addCommand alias conflicts with existing name then throw', () => {
    assert.throws(
      () => {
        const program = new Command();
        program.command('one');
        program.addCommand(new Command('unity').alias('one'));
      },
      { message: /cannot add command/ },
    );
  });
});
