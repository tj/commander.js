const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('commandUsage', () => {
  test('when single program then "program [options]"', () => {
    const program = new commander.Command();
    program.name('program');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('program [options]');
  });

  test('when multi program then "program [options] [command]"', () => {
    const program = new commander.Command();
    program.name('program');
    program.command('sub');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('program [options] [command]');
  });

  test('when program has alias then usage includes alias', () => {
    const program = new commander.Command();
    program
      .name('program')
      .alias('alias');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('program|alias [options]');
  });

  test('when help for subcommand then usage includes hierarchy', () => {
    const program = new commander.Command();
    program
      .name('program');
    const sub = program.command('sub')
      .name('sub');
    const helper = new commander.Help();
    expect(helper.commandUsage(sub)).toEqual('program sub [options]');
  });

  test('when program has argument then usage includes argument', () => {
    const program = new commander.Command();
    program
      .name('program')
      .argument('<file>');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('program [options] <file>');
  });
});
