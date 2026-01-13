const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Tests some private properties as simpler than pure tests of observable behaviours.
// Testing before and after values in some cases, to ensure value actually changes (when copied).

describe('Command.copyInheritedSettings()', () => {
  test('when add subcommand with .command() then calls copyInheritedSettings from parent', (t) => {
    const program = new commander.Command();

    // This is a bit intrusive, but check expectation that copyInheritedSettings is called internally.
    const copySettingMock = t.mock.fn();
    program.createCommand = (name) => {
      const cmd = new commander.Command(name);
      cmd.copyInheritedSettings = copySettingMock;
      return cmd;
    };
    program.command('sub');

    const callArgs = copySettingMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], program);
  });

  test('when copyInheritedSettings then copies outputConfiguration(config)', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    source.configureOutput({ foo: 'bar' });
    cmd.copyInheritedSettings(source);
    assert.equal(cmd.configureOutput().foo, 'bar');
  });

  test('when copyInheritedSettings then copies helpOption(false)', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    source.helpOption(false);
    cmd.copyInheritedSettings(source);
    assert.equal(cmd._getHelpOption(), null);
  });

  test('when copyInheritedSettings then copies helpOption(flags, description)', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    source.helpOption('-Z, --zz', 'ddd');
    cmd.copyInheritedSettings(source);
    assert.equal(cmd._getHelpOption(), source._getHelpOption());
    // const helpOption = cmd._getHelpOption();
    // expect(helpOption.flags).toBe('-Z, --zz');
    // expect(helpOption.description).toBe('ddd');
    // expect(helpOption.short).toBe('-Z');
    // expect(helpOption.long).toBe('--zz');
  });

  test('when copyInheritedSettings then copies custom help command', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    source.helpCommand('HELP [cmd]', 'ddd');
    cmd.copyInheritedSettings(source);
    cmd.helpCommand(true); // force enable
    const helpCommand = cmd._getHelpCommand();
    assert.ok(helpCommand);
    assert.equal(helpCommand.name(), 'HELP');
    assert.equal(helpCommand.description(), 'ddd');
  });

  test('when copyInheritedSettings then does not copy help enable override', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    // Existing behaviour, force enable/disable does not inherit,
    // largely so (probably redundant) program.helpCommand(true) does not inherit to leaf subcommands.
    source.helpCommand(true);
    cmd.copyInheritedSettings(source);
    assert.equal(cmd._addHelpOption, undefined);
  });

  test('when copyInheritedSettings then copies configureHelp(config)', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    const configuration = { foo: 'bar', helpWidth: 123, sortSubcommands: true };
    source.configureHelp(configuration);
    cmd.copyInheritedSettings(source);
    assert.deepEqual(cmd.configureHelp(), configuration);
  });

  test('when copyInheritedSettings then copies exitOverride()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    assert.ok(!cmd._exitCallback);
    source.exitOverride();
    cmd.copyInheritedSettings(source);
    assert.ok(cmd._exitCallback); // actually a function
  });

  test('when copyInheritedSettings then copies storeOptionsAsProperties()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    assert.ok(!cmd._storeOptionsAsProperties);
    source.storeOptionsAsProperties();
    cmd.copyInheritedSettings(source);
    assert.ok(cmd._storeOptionsAsProperties);
  });

  test('when copyInheritedSettings then copies combineFlagAndOptionalValue()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    assert.ok(cmd._combineFlagAndOptionalValue);
    source.combineFlagAndOptionalValue(false);
    cmd.copyInheritedSettings(source);
    assert.ok(!cmd._combineFlagAndOptionalValue);
  });

  test('when copyInheritedSettings then copies allowExcessArguments()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    assert.ok(!cmd._allowExcessArguments);
    source.allowExcessArguments();
    cmd.copyInheritedSettings(source);
    assert.ok(cmd._allowExcessArguments);
  });

  test('when copyInheritedSettings then copies enablePositionalOptions()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    assert.ok(!cmd._enablePositionalOptions);
    source.enablePositionalOptions();
    cmd.copyInheritedSettings(source);
    assert.ok(cmd._enablePositionalOptions);
  });

  test('when copyInheritedSettings then copies showHelpAfterError()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    assert.ok(!cmd._showHelpAfterError);
    source.showHelpAfterError();
    cmd.copyInheritedSettings(source);
    assert.ok(cmd._showHelpAfterError);
  });
});
