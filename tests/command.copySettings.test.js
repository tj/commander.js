const commander = require('../');

// Tests some private properties as simpler than pure tests of observable behaviours.
// Testing before and after values in some cases, to ensure value actually changes (when copied).

test('when add subcommand with .command() then calls copySettings from parent', () => {
  const program = new commander.Command();

  // This is a bit intrusive, but check expectation that copySettings is called internally.
  const copySettingMock = jest.fn();
  program.createCommand = (name) => {
    const cmd = new commander.Command(name);
    cmd.copySettings = copySettingMock;
    return cmd;
  };
  program.command('sub');

  expect(copySettingMock).toHaveBeenCalledWith(program);
});

describe('copySettings property tests', () => {
  test('when copySettings then copies outputConfiguration(config)', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    source.configureOutput({ foo: 'bar' });
    cmd.copySettings(source);
    expect(cmd.configureOutput().foo).toEqual('bar');
  });

  test('when copySettings then copies helpOption(false)', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();
    expect(cmd._hasHelpOption).toBeTruthy();

    source.helpOption(false);
    cmd.copySettings(source);
    expect(cmd._hasHelpOption).toBeFalsy();
  });

  test('when copySettings then copies helpOption(flags, description)', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    source.helpOption('-Z, --zz', 'ddd');
    cmd.copySettings(source);
    expect(cmd._helpFlags).toBe('-Z, --zz');
    expect(cmd._helpDescription).toBe('ddd');
    expect(cmd._helpShortFlag).toBe('-Z');
    expect(cmd._helpLongFlag).toBe('--zz');
  });

  test('when copySettings then copies addHelpCommand(name, description)', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    source.addHelpCommand('HELP [cmd]', 'ddd');
    cmd.copySettings(source);
    expect(cmd._helpCommandName).toBe('HELP');
    expect(cmd._helpCommandnameAndArgs).toBe('HELP [cmd]');
    expect(cmd._helpCommandDescription).toBe('ddd');
  });

  test('when copySettings then copies configureHelp(config)', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    const configuration = { foo: 'bar', helpWidth: 123, sortSubcommands: true };
    source.configureHelp(configuration);
    cmd.copySettings(source);
    expect(cmd.configureHelp()).toEqual(configuration);
  });

  test('when copySettings then copies exitOverride()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    expect(cmd._exitCallback).toBeFalsy();
    source.exitOverride();
    cmd.copySettings(source);
    expect(cmd._exitCallback).toBeTruthy(); // actually a function
  });

  test('when copySettings then copies storeOptionsAsProperties()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    expect(cmd._storeOptionsAsProperties).toBeFalsy();
    source.storeOptionsAsProperties();
    cmd.copySettings(source);
    expect(cmd._storeOptionsAsProperties).toBeTruthy();
  });

  test('when copySettings then copies combineFlagAndOptionalValue()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    expect(cmd._combineFlagAndOptionalValue).toBeTruthy();
    source.combineFlagAndOptionalValue(false);
    cmd.copySettings(source);
    expect(cmd._combineFlagAndOptionalValue).toBeFalsy();
  });

  test('when copySettings then copies allowExcessArguments()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    expect(cmd._allowExcessArguments).toBeTruthy();
    source.allowExcessArguments(false);
    cmd.copySettings(source);
    expect(cmd._allowExcessArguments).toBeFalsy();
  });

  test('when copySettings then copies enablePositionalOptions()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    expect(cmd._enablePositionalOptions).toBeFalsy();
    source.enablePositionalOptions();
    cmd.copySettings(source);
    expect(cmd._enablePositionalOptions).toBeTruthy();
  });

  test('when copySettings then copies showHelpAfterError()', () => {
    const source = new commander.Command();
    const cmd = new commander.Command();

    expect(cmd._showHelpAfterError).toBeFalsy();
    source.showHelpAfterError();
    cmd.copySettings(source);
    expect(cmd._showHelpAfterError).toBeTruthy();
  });
});
