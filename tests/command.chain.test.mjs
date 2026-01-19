import { Command, Option, Argument } from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Testing the functions which should chain.
// parse and parseAsync are tested in command.parse.test.js

describe('Command methods that should return this for chaining', () => {
  test('when call .command() with description for stand-alone executable then returns this', () => {
    const program = new Command();
    const result = program.command('foo', 'foo description');
    assert.equal(result, program);
  });

  test('when call .addCommand() then returns this', () => {
    const program = new Command();
    const result = program.addCommand(new Command('name'));
    assert.equal(result, program);
  });

  test('when call .argument() then returns this', () => {
    const program = new Command();
    const result = program.argument('<file>');
    assert.equal(result, program);
  });

  test('when call .addArgument() then returns this', () => {
    const program = new Command();
    const result = program.addArgument(new Argument('<file>'));
    assert.equal(result, program);
  });

  test('when set .arguments() then returns this', () => {
    const program = new Command();
    const result = program.arguments('<file>');
    assert.equal(result, program);
  });

  test('when call .addHelpCommand(cmd) then returns this', () => {
    const program = new Command();
    const result = program.addHelpCommand(new Command('assist'));
    assert.equal(result, program);
  });

  test('when call deprecated .addHelpCommand() then returns this', () => {
    const program = new Command();
    const result = program.addHelpCommand();
    assert.equal(result, program);
  });

  test('when call deprecated .addHelpCommand(boolean) then returns this', () => {
    const program = new Command();
    const result1 = program.addHelpCommand(true);
    assert.equal(result1, program);
    const result2 = program.addHelpCommand(false);
    assert.equal(result2, program);
  });

  test('when call deprecated .addHelpCommand(string[, string]) then returns this', () => {
    const program = new Command();
    const result1 = program.addHelpCommand('assist');
    assert.equal(result1, program);
    const result2 = program.addHelpCommand('assist', 'assist description');
    assert.equal(result2, program);
  });

  test('when call .helpCommand(name) then returns this', () => {
    const program = new Command();
    const result = program.helpCommand();
    assert.equal(result, program);
  });

  test('when call .helpCommand(name, description) then returns this', () => {
    const program = new Command();
    const result1 = program.helpCommand('assist', 'assist description');
    assert.equal(result1, program);
  });

  test('when call .helpCommand(boolean) then returns this', () => {
    const program = new Command();
    const result1 = program.helpCommand(true);
    assert.equal(result1, program);
    const result2 = program.helpCommand(false);
    assert.equal(result2, program);
  });

  test('when call .exitOverride() then returns this', () => {
    const program = new Command();
    const result = program.exitOverride(() => {});
    assert.equal(result, program);
  });

  test('when call .action() then returns this', () => {
    const program = new Command();
    const result = program.action(() => {});
    assert.equal(result, program);
  });

  test('when call .addOption() then returns this', () => {
    const program = new Command();
    const result = program.addOption(new Option('-e'));
    assert.equal(result, program);
  });

  test('when call .option() then returns this', () => {
    const program = new Command();
    const result = program.option('-e');
    assert.equal(result, program);
  });

  test('when call .requiredOption() then returns this', () => {
    const program = new Command();
    const result = program.requiredOption('-r');
    assert.equal(result, program);
  });

  test('when call .combineFlagAndOptionalValue() then returns this', () => {
    const program = new Command();
    const result = program.combineFlagAndOptionalValue();
    assert.equal(result, program);
  });

  test('when call .allowUnknownOption() then returns this', () => {
    const program = new Command();
    const result = program.allowUnknownOption();
    assert.equal(result, program);
  });

  test('when call .allowExcessArguments() then returns this', () => {
    const program = new Command();
    const result = program.allowExcessArguments();
    assert.equal(result, program);
  });

  test('when call .storeOptionsAsProperties() then returns this', () => {
    const program = new Command();
    const result = program.storeOptionsAsProperties();
    assert.equal(result, program);
  });

  test('when call .version() then returns this', () => {
    const program = new Command();
    const result = program.version('1.2.3');
    assert.equal(result, program);
  });

  test('when set .description() then returns this', () => {
    const program = new Command();
    const result = program.description('description');
    assert.equal(result, program);
  });

  test('when set .alias() then returns this', () => {
    const program = new Command();
    const result = program.alias('alias');
    assert.equal(result, program);
  });

  test('when set .aliases() then returns this', () => {
    const program = new Command();
    const result = program.aliases(['foo', 'bar']);
    assert.equal(result, program);
  });

  test('when set .usage() then returns this', () => {
    const program = new Command();
    const result = program.usage('[options]');
    assert.equal(result, program);
  });

  test('when set .name() then returns this', () => {
    const program = new Command();
    const result = program.name('easy');
    assert.equal(result, program);
  });

  test('when call .helpOption(flags) then returns this', () => {
    const program = new Command();
    const flags = '-h, --help';
    const result = program.helpOption(flags);
    assert.equal(result, program);
  });

  test('when call .addHelpOption() then returns this', () => {
    const program = new Command();
    const result = program.addHelpOption(new Option('-h, --help'));
    assert.equal(result, program);
  });

  test('when call .addHelpText() then returns this', () => {
    const program = new Command();
    const result = program.addHelpText('before', 'example');
    assert.equal(result, program);
  });

  test('when call .configureHelp() then returns this', () => {
    const program = new Command();
    const result = program.configureHelp({});
    assert.equal(result, program);
  });

  test('when call .configureOutput() then returns this', () => {
    const program = new Command();
    const result = program.configureOutput({});
    assert.equal(result, program);
  });

  test('when call .passThroughOptions() then returns this', () => {
    const program = new Command();
    const result = program.passThroughOptions();
    assert.equal(result, program);
  });

  test('when call .enablePositionalOptions() then returns this', () => {
    const program = new Command();
    const result = program.enablePositionalOptions();
    assert.equal(result, program);
  });

  test('when call .hook() then returns this', () => {
    const program = new Command();
    const result = program.hook('preAction', () => {});
    assert.equal(result, program);
  });

  test('when call .setOptionValue() then returns this', () => {
    const program = new Command();
    const result = program.setOptionValue('foo', 'bar');
    assert.equal(result, program);
  });

  test('when call .setOptionValueWithSource() then returns this', () => {
    const program = new Command();
    const result = program.setOptionValueWithSource('foo', 'bar', 'cli');
    assert.equal(result, program);
  });

  test('when call .showHelpAfterError() then returns this', () => {
    const program = new Command();
    const result = program.showHelpAfterError();
    assert.equal(result, program);
  });

  test('when call .showSuggestionAfterError() then returns this', () => {
    const program = new Command();
    const result = program.showSuggestionAfterError();
    assert.equal(result, program);
  });

  test('when call .copyInheritedSettings() then returns this', () => {
    const program = new Command();
    const cmd = new Command();
    const result = cmd.copyInheritedSettings(program);
    assert.equal(result, cmd);
  });

  test('when set .nameFromFilename() then returns this', () => {
    const program = new Command();
    const result = program.nameFromFilename('name');
    assert.equal(result, program);
  });

  test('when set .helpGroup(heading) then returns this', () => {
    const program = new Command();
    const result = program.helpGroup('Commands:');
    assert.equal(result, program);
  });

  test('when set .commandsGroup(heading) then returns this', () => {
    const program = new Command();
    const result = program.commandsGroup('Commands:');
    assert.equal(result, program);
  });

  test('when set .optionsGroup(heading) then returns this', () => {
    const program = new Command();
    const result = program.optionsGroup('Options:');
    assert.equal(result, program);
  });
});
