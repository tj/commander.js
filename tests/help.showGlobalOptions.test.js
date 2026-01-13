const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Help.showGlobalOptions()', () => {
  test('when default configuration then global options hidden', () => {
    const program = new commander.Command();
    program.option('--global');
    const sub = program.command('sub');
    assert.doesNotMatch(sub.helpInformation(), /global/);
  });

  test('when showGlobalOptions:true then program options shown', () => {
    const program = new commander.Command();
    program.option('--global').configureHelp({ showGlobalOptions: true });
    const sub = program.command('sub');
    assert.match(sub.helpInformation(), /global/);
  });

  test('when showGlobalOptions:true and no global options then global options header not shown', () => {
    const program = new commander.Command();
    program.configureHelp({ showGlobalOptions: true });
    const sub = program.command('sub');
    assert.doesNotMatch(sub.helpInformation(), /Global/);
  });

  test('when showGlobalOptions:true and nested commands then combined nested options shown program last', () => {
    const program = new commander.Command();
    program.option('--global').configureHelp({ showGlobalOptions: true });
    const sub1 = program.command('sub1').option('--sub1');
    const sub2 = sub1.command('sub2');
    assert.match(
      sub2.helpInformation(),
      /Global Options:\n {2}--sub1\n {2}--global\n/,
    );
  });

  test('when showGlobalOptions:true and sortOptions: true then global options sorted', () => {
    const program = new commander.Command();
    program
      .option('-3')
      .option('-4')
      .option('-2')
      .configureHelp({ showGlobalOptions: true, sortOptions: true });
    const sub1 = program.command('sub1').option('-6').option('-1').option('-5');
    const sub2 = sub1.command('sub2');
    assert.match(
      sub2.helpInformation(),
      /Global Options:\n {2}-1\n {2}-2\n {2}-3\n {2}-4\n {2}-5\n {2}-6\n/,
    );
  });
});
