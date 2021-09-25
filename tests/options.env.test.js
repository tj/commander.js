const commander = require('../');

// treating optional same as required, treat as option taking value rather than as boolean
describe.each(['-f, --foo <required-arg>', '-f, --foo [optional-arg]'])('option declared as: %s', (fooFlags) => {
  test('when env undefined and no cli then option undefined', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option(fooFlags).env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBeUndefined();
  });

  test('when env defined and no cli then option from env', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option(fooFlags).env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe('env');
    delete process.env.BAR;
  });

  test('when env defined and cli then option from cli', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option(fooFlags).env('BAR'));
    program.parse(['--foo', 'cli'], { from: 'user' });
    expect(program.opts().foo).toBe('cli');
    delete process.env.BAR;
  });

  test('when env defined and value source is config then option from env', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option(fooFlags).env('BAR'));
    program.setOptionValueWithSource('foo', 'config', 'config');
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe('env');
    delete process.env.BAR;
  });

  test('when env defined and value source is unspecified then option unchanged', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option(fooFlags).env('BAR'));
    program.setOptionValue('foo', 'client');
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe('client');
    delete process.env.BAR;
  });

  test('when default and env undefined and no cli then option from default', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option(fooFlags).env('BAR').default('default'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe('default');
  });

  test('when default and env defined and no cli then option from env', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option(fooFlags).env('BAR').default('default'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe('env');
    delete process.env.BAR;
  });

  test('when default and env defined and cli then option from cli', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option(fooFlags).env('BAR').default('default'));
    program.parse(['--foo', 'cli'], { from: 'user' });
    expect(program.opts().foo).toBe('cli');
    delete process.env.BAR;
  });
});

describe('boolean flag', () => {
  test('when env undefined and no cli then option undefined', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBeUndefined();
  });

  test('when env defined with value and no cli then option true', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.BAR;
  });

  test('when env is "" and no cli then option true', () => {
    // any string, including ""
    const program = new commander.Command();
    process.env.BAR = '';
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.BAR;
  });

  test('when env is "0" and no cli then option true', () => {
    // any string, including "0"
    const program = new commander.Command();
    process.env.BAR = '0';
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.BAR;
  });

  test('when env is "false" and no cli then option true', () => {
    // any string, including "false"
    const program = new commander.Command();
    process.env.BAR = 'false';
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.BAR;
  });
});

describe('boolean no-flag', () => {
  test('when env undefined and no cli then option true', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
  });

  test('when env defined and no cli then option false', () => {
    const program = new commander.Command();
    process.env.NO_BAR = 'env';
    program.addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(false);
    delete process.env.NO_BAR;
  });
});

describe('boolean flag and negatable', () => {
  test('when env undefined and no cli then option undefined', () => {
    const program = new commander.Command();
    program
      .addOption(new commander.Option('-f, --foo').env('BAR'))
      .addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBeUndefined();
  });

  test('when env defined and no cli then option true', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program
      .addOption(new commander.Option('-f, --foo').env('BAR'))
      .addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.BAR;
  });

  test('when env defined and cli --no-foo then option false', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program
      .addOption(new commander.Option('-f, --foo').env('BAR'))
      .addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse(['--no-foo'], { from: 'user' });
    expect(program.opts().foo).toBe(false);
    delete process.env.BAR;
  });

  test('when no_env defined and no cli then option false', () => {
    const program = new commander.Command();
    process.env.NO_BAR = 'env';
    program
      .addOption(new commander.Option('-f, --foo').env('BAR'))
      .addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(false);
    delete process.env.NO_BAR;
  });

  test('when no_env defined and cli --foo then option true', () => {
    const program = new commander.Command();
    process.env.NO_BAR = 'env';
    program
      .addOption(new commander.Option('-f, --foo').env('BAR'))
      .addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse(['--foo'], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.NO_BAR;
  });
});

describe('custom argParser', () => {
  test('when env defined and no cli then custom parse from env', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required>').env('BAR').argParser(str => str.toUpperCase()));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe('ENV');
    delete process.env.BAR;
  });
});

describe('variadic', () => {
  test('when env defined and no cli then array from env', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required...>').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toEqual(['env']);
    delete process.env.BAR;
  });

  test('when env defined and cli then array from cli', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required...>').env('BAR'));
    program.parse(['--foo', 'cli'], { from: 'user' });
    expect(program.opts().foo).toEqual(['cli']);
    delete process.env.BAR;
  });
});

describe('env only processed when applies', () => {
  test('when env defined on another subcommand then env not applied', () => {
    // Doing selective processing. Not processing env at addOption time.
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.command('one')
      .action(() => {});
    const two = program.command('two')
      .addOption(new commander.Option('-f, --foo <required...>').env('BAR').default('default'))
      .action(() => {});
    program.parse(['one'], { from: 'user' });
    expect(two.opts().foo).toBe('default');
    delete process.env.BAR;
  });

  test('when env and cli defined then only emit option event for cli', () => {
    const program = new commander.Command();
    const optionEventMock = jest.fn();
    const optionEnvEventMock = jest.fn();
    program.on('option:foo', optionEventMock);
    program.on('optionEnv:foo', optionEnvEventMock);
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required...>').env('BAR'));
    program.parse(['--foo', 'cli'], { from: 'user' });
    expect(optionEventMock).toHaveBeenCalledWith('cli');
    expect(optionEventMock).toHaveBeenCalledTimes(1);
    expect(optionEnvEventMock).toHaveBeenCalledTimes(0);
    delete process.env.BAR;
  });

  test('when env and cli defined then only parse value for cli', () => {
    const program = new commander.Command();
    const parseMock = jest.fn();
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required...>').env('BAR').argParser(parseMock));
    program.parse(['--foo', 'cli'], { from: 'user' });
    expect(parseMock).toHaveBeenCalledWith('cli', undefined);
    expect(parseMock).toHaveBeenCalledTimes(1);
    delete process.env.BAR;
  });
});

describe('events dispatched for env', () => {
  const optionEnvEventMock = jest.fn();

  afterEach(() => {
    optionEnvEventMock.mockClear();
    delete process.env.BAR;
  });

  test('when env defined then emit "optionEnv" and not "option"', () => {
    // Decided to do separate events, so test stays that way.
    const program = new commander.Command();
    const optionEventMock = jest.fn();
    program.on('option:foo', optionEventMock);
    program.on('optionEnv:foo', optionEnvEventMock);
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required>').env('BAR'));
    program.parse([], { from: 'user' });
    expect(optionEventMock).toHaveBeenCalledTimes(0);
    expect(optionEnvEventMock).toHaveBeenCalledTimes(1);
  });

  test('when env defined for required then emit "optionEnv" with value', () => {
    const program = new commander.Command();
    program.on('optionEnv:foo', optionEnvEventMock);
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required>').env('BAR'));
    program.parse([], { from: 'user' });
    expect(optionEnvEventMock).toHaveBeenCalledWith('env');
  });

  test('when env defined for optional then emit "optionEnv" with value', () => {
    const program = new commander.Command();
    program.on('optionEnv:foo', optionEnvEventMock);
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo [optional]').env('BAR'));
    program.parse([], { from: 'user' });
    expect(optionEnvEventMock).toHaveBeenCalledWith('env');
  });

  test('when env defined for boolean then emit "optionEnv" with no param', () => {
    // check matches historical boolean action event
    const program = new commander.Command();
    program.on('optionEnv:foo', optionEnvEventMock);
    process.env.BAR = 'anything';
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(optionEnvEventMock).toHaveBeenCalledWith();
  });

  test('when env defined for negated boolean then emit "optionEnv" with no param', () => {
    // check matches historical boolean action event
    const program = new commander.Command();
    program.on('optionEnv:no-foo', optionEnvEventMock);
    process.env.BAR = 'anything';
    program.addOption(new commander.Option('-F, --no-foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(optionEnvEventMock).toHaveBeenCalledWith();
  });
});
