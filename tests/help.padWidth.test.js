import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('Help.padWidth()', () => {
  test('when argument term longest return argument length', () => {
    const longestThing = 'veryLongThingBiggerThanOthers';
    const program = new commander.Command();
    program.argument(`<${longestThing}>`, 'description').option('-o');
    program.command('sub');
    const helper = new commander.Help();
    assert.equal(helper.padWidth(program, helper), longestThing.length);
  });

  test('when option term longest return option length', () => {
    const longestThing = '--very-long-thing-bigger-than-others';
    const program = new commander.Command();
    program.argument('<file>', 'desc').option(longestThing);
    program.command('sub');
    const helper = new commander.Help();
    assert.equal(helper.padWidth(program, helper), longestThing.length);
  });

  test('when global option term longest return global option length', () => {
    const longestThing = '--very-long-thing-bigger-than-others';
    const program = new commander.Command();
    program
      .argument('<file>', 'desc')
      .option(longestThing)
      .configureHelp({ showGlobalOptions: true });
    const sub = program.command('sub');
    const helper = sub.createHelp();
    assert.equal(helper.padWidth(sub, helper), longestThing.length);
  });

  test('when command term longest return command length', () => {
    const longestThing = 'very-long-thing-bigger-than-others';
    const program = new commander.Command();
    program.argument('<file>', 'desc').option('-o');
    program.command(longestThing);
    const helper = new commander.Help();
    assert.equal(helper.padWidth(program, helper), longestThing.length);
  });
});
