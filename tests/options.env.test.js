const commander = require('../');

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
    expect(program.opts().foo).toEqual('env');
    delete process.env.BAR;
  });

  test('when env defined and cli then option from cli', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option(fooFlags).env('BAR'));
    program.parse(['--foo', 'cli'], { from: 'user' });
    expect(program.opts().foo).toEqual('cli');
    delete process.env.BAR;
  });

  test('when default and env undefined and no cli then option from default', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option(fooFlags).env('BAR').default('default'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toEqual('default');
  });

  test('when default and env defined and no cli then option from env', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option(fooFlags).env('BAR').default('default'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toEqual('env');
    delete process.env.BAR;
  });

  test('when default and env defined and cli then option from cli', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option(fooFlags).env('BAR').default('default'));
    program.parse(['--foo', 'cli'], { from: 'user' });
    expect(program.opts().foo).toEqual('cli');
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
