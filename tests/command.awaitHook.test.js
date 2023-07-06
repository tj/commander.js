const commander = require('../');

describe('awaitHook with arguments', () => {
  test('when awaitHook and arguments with custom processing then .processedArgs and actioon arguments resolved from callback', async() => {
    const resolvedValues = [3, 4];
    const awaited = [
      { then: (fn) => fn(resolvedValues[0]) },
      resolvedValues[1]
    ];
    const mockCoercions = awaited.map(
      value => jest.fn().mockImplementation(() => value)
    );

    let actionValues;
    const program = new commander.Command();
    program
      .argument('<arg>', 'desc', mockCoercions[0])
      .argument('[arg]', 'desc', mockCoercions[1])
      .awaitHook()
      .action((...args) => {
        actionValues = args.slice(0, resolvedValues.length);
      });

    const result = program.parseAsync(['1', '2'], { from: 'user' });
    expect(program.processedArgs).toEqual(awaited);
    await result;
    expect(program.processedArgs).toEqual(resolvedValues);
    expect(actionValues).toEqual(resolvedValues);
  });

  test('when awaitHook and arguments not specified with default values then .processedArgs and actioon arguments resolved from default values', async() => {
    const resolvedValues = [1, 2];
    const awaited = [
      { then: (fn) => fn(resolvedValues[0]) },
      resolvedValues[1]
    ];

    let actionValues;
    const program = new commander.Command();
    program
      .argument('[arg]', 'desc', awaited[0])
      .argument('[arg]', 'desc', awaited[1])
      .awaitHook()
      .action((...args) => {
        actionValues = args.slice(0, resolvedValues.length);
      });

    const result = program.parseAsync([], { from: 'user' });
    expect(program.processedArgs).toEqual(awaited);
    await result;
    expect(program.processedArgs).toEqual(resolvedValues);
    expect(actionValues).toEqual(resolvedValues);
  });
});

describe('awaitHook with options', () => {
  test('when awaitHook and options with custom processing then .opts() resolved from callback', async() => {
    const resolvedValues = { a: 3, b: 4 };
    const awaited = {
      a: { then: (fn) => fn(resolvedValues.a) },
      b: resolvedValues.b
    };
    const mockCoercions = Object.entries(awaited).reduce((acc, [key, value]) => {
      acc[key] = jest.fn().mockImplementation(() => value);
      return acc;
    }, {});

    const program = new commander.Command();
    program
      .option('-a <arg>', 'desc', mockCoercions.a)
      .option('-b [arg]', 'desc', mockCoercions.b)
      .awaitHook()
      .action(() => {});

    const result = program.parseAsync(['-a', '1', '-b', '2'], { from: 'user' });
    expect(program.opts()).toEqual(awaited);
    await result;
    expect(program.opts()).toEqual(resolvedValues);
    expect(program.getOptionValueSource('a')).toEqual('cli');
    expect(program.getOptionValueSource('b')).toEqual('cli');
  });

  test('when awaitHook and options not specified with default values then .opts() resolved from default values', async() => {
    const resolvedValues = { a: 1, b: 2 };
    const awaited = {
      a: { then: (fn) => fn(resolvedValues.a) },
      b: resolvedValues.b
    };

    const program = new commander.Command();
    program
      .option('-a <arg>', 'desc', awaited.a)
      .option('-b [arg]', 'desc', awaited.b)
      .awaitHook()
      .action(() => {});

    const result = program.parseAsync([], { from: 'user' });
    expect(program.opts()).toEqual(awaited);
    await result;
    expect(program.opts()).toEqual(resolvedValues);
    expect(program.getOptionValueSource('a')).toEqual('default');
    expect(program.getOptionValueSource('b')).toEqual('default');
  });

  test('when awaitHook and implied option values then .opts() resolved from implied values', async() => {
    const resolvedValues = { a: 1, b: 2 };
    const awaited = {
      a: { then: (fn) => fn(resolvedValues.a) },
      b: resolvedValues.b
    };

    const option = new commander.Option('-c').implies(awaited);
    const program = new commander.Command();
    program
      .option('-a <arg>')
      .option('-b [arg]')
      .addOption(option)
      .awaitHook()
      .action(() => {});

    const result = program.parseAsync(['-c'], { from: 'user' });
    expect(program.opts()).toEqual({ ...awaited, c: true });
    await result;
    expect(program.opts()).toEqual({ ...resolvedValues, c: true });
    expect(program.getOptionValueSource('a')).toEqual('implied');
    expect(program.getOptionValueSource('b')).toEqual('implied');
  });
});
