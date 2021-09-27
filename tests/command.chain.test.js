const { Command, Option, Argument } = require('../');

// Testing the functions which should chain.
// parse and parseAsync are tested in command.parse.test.js

describe('Command methods that should return this for chaining', () => {
  test('when call .command() with description for stand-alone executable then returns this', () => {
    const program = new Command();
    const result = program.command('foo', 'foo description');
    expect(result).toBe(program);
  });

  test('when call .addCommand() then returns this', () => {
    const program = new Command();
    const result = program.addCommand(new Command('name'));
    expect(result).toBe(program);
  });

  test('when call .argument() then returns this', () => {
    const program = new Command();
    const result = program.argument('<file>');
    expect(result).toBe(program);
  });

  test('when call .addArgument() then returns this', () => {
    const program = new Command();
    const result = program.addArgument(new Argument('<file>'));
    expect(result).toBe(program);
  });

  test('when set .arguments() then returns this', () => {
    const program = new Command();
    const result = program.arguments('<file>');
    expect(result).toBe(program);
  });

  test('when call .addHelpCommand() then returns this', () => {
    const program = new Command();
    const result = program.addHelpCommand(false);
    expect(result).toBe(program);
  });

  test('when call .exitOverride() then returns this', () => {
    const program = new Command();
    const result = program.exitOverride(() => { });
    expect(result).toBe(program);
  });

  test('when call .action() then returns this', () => {
    const program = new Command();
    const result = program.action(() => { });
    expect(result).toBe(program);
  });

  test('when call .addOption() then returns this', () => {
    const program = new Command();
    const result = program.addOption(new Option('-e'));
    expect(result).toBe(program);
  });

  test('when call .option() then returns this', () => {
    const program = new Command();
    const result = program.option('-e');
    expect(result).toBe(program);
  });

  test('when call .requiredOption() then returns this', () => {
    const program = new Command();
    const result = program.requiredOption('-r');
    expect(result).toBe(program);
  });

  test('when call .combineFlagAndOptionalValue() then returns this', () => {
    const program = new Command();
    const result = program.combineFlagAndOptionalValue();
    expect(result).toBe(program);
  });

  test('when call .allowUnknownOption() then returns this', () => {
    const program = new Command();
    const result = program.allowUnknownOption();
    expect(result).toBe(program);
  });

  test('when call .allowExcessArguments() then returns this', () => {
    const program = new Command();
    const result = program.allowExcessArguments();
    expect(result).toBe(program);
  });

  test('when call .storeOptionsAsProperties() then returns this', () => {
    const program = new Command();
    const result = program.storeOptionsAsProperties();
    expect(result).toBe(program);
  });

  test('when call .version() then returns this', () => {
    const program = new Command();
    const result = program.version('1.2.3');
    expect(result).toBe(program);
  });

  test('when set .description() then returns this', () => {
    const program = new Command();
    const result = program.description('description');
    expect(result).toBe(program);
  });

  test('when set .alias() then returns this', () => {
    const program = new Command();
    const result = program.alias('alias');
    expect(result).toBe(program);
  });

  test('when set .aliases() then returns this', () => {
    const program = new Command();
    const result = program.aliases(['foo', 'bar']);
    expect(result).toBe(program);
  });

  test('when set .usage() then returns this', () => {
    const program = new Command();
    const result = program.usage('[options]');
    expect(result).toBe(program);
  });

  test('when set .name() then returns this', () => {
    const program = new Command();
    const result = program.name('easy');
    expect(result).toBe(program);
  });

  test('when call .helpOption() then returns this', () => {
    const program = new Command();
    const result = program.helpOption(false);
    expect(result).toBe(program);
  });

  test('when call .addHelpText() then returns this', () => {
    const program = new Command();
    const result = program.addHelpText('before', 'example');
    expect(result).toBe(program);
  });

  test('when call .configureHelp() then returns this', () => {
    const program = new Command();
    const result = program.configureHelp({ });
    expect(result).toBe(program);
  });

  test('when call .configureOutput() then returns this', () => {
    const program = new Command();
    const result = program.configureOutput({ });
    expect(result).toBe(program);
  });

  test('when call .passThroughOptions() then returns this', () => {
    const program = new Command();
    const result = program.passThroughOptions();
    expect(result).toBe(program);
  });

  test('when call .enablePositionalOptions() then returns this', () => {
    const program = new Command();
    const result = program.enablePositionalOptions();
    expect(result).toBe(program);
  });

  test('when call .hook() then returns this', () => {
    const program = new Command();
    const result = program.hook('preAction', () => {});
    expect(result).toBe(program);
  });

  test('when call .setOptionValue() then returns this', () => {
    const program = new Command();
    const result = program.setOptionValue('foo', 'bar');
    expect(result).toBe(program);
  });

  test('when call .setOptionValueWithSource() then returns this', () => {
    const program = new Command();
    const result = program.setOptionValueWithSource('foo', 'bar', 'cli');
    expect(result).toBe(program);
  });

  test('when call .showHelpAfterError() then returns this', () => {
    const program = new Command();
    const result = program.showHelpAfterError();
    expect(result).toBe(program);
  });

  test('when call .showSuggestionAfterError() then returns this', () => {
    const program = new Command();
    const result = program.showSuggestionAfterError();
    expect(result).toBe(program);
  });

  test('when call .copyInheritedSettings() then returns this', () => {
    const program = new Command();
    const cmd = new Command();
    const result = cmd.copyInheritedSettings(program);
    expect(result).toBe(cmd);
  });
});
