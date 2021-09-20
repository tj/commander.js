const { Command, Option } = require('../');

// Some repetition in test implementation across different blocks.

describe('check config keys', () => {
  test('when use short flag then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('-d, --debug');
    program.mergeConfig({ '-d': true });
    expect(program.opts().debug).toBe(true);
  });

  test('when use long flag then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('-d, --debug');
    program.mergeConfig({ '--debug': true });
    expect(program.opts().debug).toBe(true);
  });

  test('when use property name then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('--dashed-words');
    program.mergeConfig({ dashedWords: true });
    expect(program.opts().dashedWords).toBe(true);
  });

  test('when use property name of negated then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('--no-colour');
    program.mergeConfig({ colour: false });
    expect(program.opts().colour).toBe(false);
  });
});

describe('check happy config values', () => {
  test('when boolean option with true then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('-d, --debug');
    program.mergeConfig({ debug: true });
    expect(program.opts().debug).toBe(true);
  });

  test('when negated property name with false then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('--no-colour');
    program.mergeConfig({ colour: false });
    expect(program.opts().colour).toBe(false);
  });

  test('when negated flag with true then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('--no-colour');
    program.mergeConfig({ '--no-colour': true });
    expect(program.opts().colour).toBe(false);
  });

  test('when boolean option and negated with true then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('--colour');
    program.option('--no-colour');
    program.mergeConfig({ colour: true });
    expect(program.opts().colour).toBe(true);
  });

  test('when boolean option and negated with false then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('--colour');
    program.option('--no-colour');
    program.mergeConfig({ colour: false });
    expect(program.opts().colour).toBe(false);
  });

  test('when require with string then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('--port <number>');
    program.mergeConfig({ port: '80' });
    expect(program.opts().port).toBe('80');
  });

  test('when require with array of strings then merged', () => {
    // Don't need variadic to use array. Treated same way as specifying multiple times on command-line.
    const program = new Command();
    program.exitOverride();
    program.option('--port <number>');
    program.mergeConfig({ port: ['1', '2'] });
    expect(program.opts().port).toBe('2');
  });

  test('when require... with string then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('--port <number...>');
    program.mergeConfig({ port: '80' });
    expect(program.opts().port).toEqual(['80']);
  });

  test('when require... with array of strings then merged', () => {
    // Don't need variadic to use array. Treated same way as specifying multiple times on command-line.
    const program = new Command();
    program.exitOverride();
    program.option('--port <number...>');
    program.mergeConfig({ port: ['1', '2'] });
    expect(program.opts().port).toEqual(['1', '2']);
  });

  test('when optional with string then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('--port [number]');
    program.mergeConfig({ port: '80' });
    expect(program.opts().port).toBe('80');
  });

  test('when optional with true then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('--port [number]');
    program.mergeConfig({ port: true });
    expect(program.opts().port).toBe(true);
  });
});

describe('check happy custom parsing', () => {
  test('when boolean option with true then merged', () => {
    const program = new Command();
    program.exitOverride();
    program.option('-f, --float <number>', 'description', parseFloat);
    program.mergeConfig({ float: '1e3' });
    expect(program.opts().float).toBe(1000);
  });
});

describe('check priority', () => {
  test('when default and config then option from config', () => {
    const program = new Command();
    program.option('--port <number>', 'description', 'default');
    program.parse([], { from: 'user' });
    program.mergeConfig({ port: 'config' });
    expect(program.opts().port).toBe('config');
  });

  test('when env and config then option from env', () => {
    const program = new Command();
    process.env.PORT = 'env';
    program.addOption(new Option('-p, --port <number>').env('PORT'));
    program.parse([], { from: 'user' });
    program.mergeConfig({ port: 'config' });
    expect(program.opts().port).toBe('env');
    delete process.env.PORT;
  });

  test('when cli and config then option from cli', () => {
    const program = new Command();
    program.option('--port <number>', 'description', 'default');
    program.parse(['--port=cli'], { from: 'user' });
    program.mergeConfig({ port: 'config' });
    expect(program.opts().port).toBe('cli');
  });
});

describe('merge of different priority with variadic does override not combine', () => {
  test('when env and config then option from env', () => {
    const program = new Command();
    process.env.PORT = 'env';
    program.addOption(new Option('-p, --port <number...>').env('PORT'));
    program.parse([], { from: 'user' });
    program.mergeConfig({ port: 'config' });
    expect(program.opts().port).toEqual(['env']);
    delete process.env.PORT;
  });

  test('when cli and config then option from cli', () => {
    const program = new Command();
    program.option('--port <number...>', 'description');
    program.parse(['--port=cli'], { from: 'user' });
    program.mergeConfig({ port: 'config' });
    expect(program.opts().port).toEqual(['cli']);
  });
});

describe('double config', () => {
  test('when merge with different keys then both in option values', () => {
    const program = new Command();
    program
      .option('-a <value>')
      .option('-b <value>');
    program.mergeConfig({ a: 'aa' });
    program.mergeConfig({ b: 'bb' });
    expect(program.opts()).toEqual({ a: 'aa', b: 'bb' });
  });

  test('when merge with same keys then combined', () => {
    const program = new Command();
    program.option('--port <number...>', 'description');
    program.mergeConfig({ port: '1' });
    program.mergeConfig({ port: '2' });
    expect(program.opts().port).toEqual(['1', '2']);
  });
});
