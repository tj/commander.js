import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Command.configureHelp()', () => {
  test('when configure program then affects program helpInformation', () => {
    const program = new commander.Command();
    program.configureHelp({
      formatHelp: () => {
        return 'custom';
      },
    });
    assert.equal(program.helpInformation(), 'custom');
  });

  test('when configure program then affects subcommand helpInformation', () => {
    const program = new commander.Command();
    program.configureHelp({
      formatHelp: () => {
        return 'custom';
      },
    });
    const sub = program.command('sub');
    assert.equal(sub.helpInformation(), 'custom');
  });

  test('when configure with unknown property then createHelp has unknown property', () => {
    const program = new commander.Command();
    program.configureHelp({ mySecretValue: 'secret' });
    assert.equal(program.createHelp().mySecretValue, 'secret');
  });

  test('when configure with unknown property then helper passed to formatHelp has unknown property', () => {
    const program = new commander.Command();
    program.configureHelp({
      mySecretValue: 'secret',
      formatHelp: (cmd, helper) => {
        return helper.mySecretValue;
      },
    });
    assert.equal(program.helpInformation(), 'secret');
  });
});
