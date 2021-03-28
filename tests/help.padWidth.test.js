const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('padWidth', () => {
  test('when argument term longest return argument length', () => {
    const longestThing = 'veryLongThingBiggerThanOthers';
    const program = new commander.Command();
    program
      .argument(`<${longestThing}>`, 'description')
      .option('-o');
    program
      .command('sub');
    const helper = new commander.Help();
    expect(helper.padWidth(program, helper)).toEqual(longestThing.length);
  });

  test('when option term longest return option length', () => {
    const longestThing = '--very-long-thing-bigger-than-others';
    const program = new commander.Command();
    program
      .argument('<file>', 'desc')
      .option(longestThing);
    program
      .command('sub');
    const helper = new commander.Help();
    expect(helper.padWidth(program, helper)).toEqual(longestThing.length);
  });

  test('when command term longest return command length', () => {
    const longestThing = 'very-long-thing-bigger-than-others';
    const program = new commander.Command();
    program
      .argument('<file>', 'desc')
      .option('-o');
    program
      .command(longestThing);
    const helper = new commander.Help();
    expect(helper.padWidth(program, helper)).toEqual(longestThing.length);
  });
});
