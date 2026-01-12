const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('Help.visibleOptions()', () => {
  test('when no options then just help visible', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    const visibleOptionNames = helper
      .visibleOptions(program)
      .map((option) => option.name());
    assert.deepEqual(visibleOptionNames, ['help']);
  });

  test('when no options and no help option then empty array', () => {
    const program = new commander.Command();
    program.helpOption(false);
    const helper = new commander.Help();
    assert.deepEqual(helper.visibleOptions(program), []);
  });

  test('when add option then visible (with help)', () => {
    const program = new commander.Command();
    program.option('-v,--visible');
    const helper = new commander.Help();
    const visibleOptionNames = helper
      .visibleOptions(program)
      .map((option) => option.name());
    assert.deepEqual(visibleOptionNames, ['visible', 'help']);
  });

  test('when option hidden then not visible', () => {
    const program = new commander.Command();
    program
      .option('-v,--visible')
      .addOption(new commander.Option('--invisible').hideHelp());
    const helper = new commander.Help();
    const visibleOptionNames = helper
      .visibleOptions(program)
      .map((option) => option.name());
    assert.deepEqual(visibleOptionNames, ['visible', 'help']);
  });
});

describe('implicit help', () => {
  test('when default then help term is -h, --help', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    const implicitHelp = helper.visibleOptions(program)[0];
    assert.equal(helper.optionTerm(implicitHelp), '-h, --help');
  });

  test('when short flag obscured then help term is --help', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('-h, --huge').hideHelp());
    const helper = new commander.Help();
    const implicitHelp = helper.visibleOptions(program)[0];
    assert.equal(helper.optionTerm(implicitHelp), '--help');
  });

  test('when long flag obscured then help term is --h', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('-H, --help').hideHelp());
    const helper = new commander.Help();
    const implicitHelp = helper.visibleOptions(program)[0];
    assert.equal(helper.optionTerm(implicitHelp), '-h');
  });

  test('when help flags obscured then implicit help hidden', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('-h, --help').hideHelp());
    const helper = new commander.Help();
    assert.deepEqual(helper.visibleOptions(program), []);
  });
});
