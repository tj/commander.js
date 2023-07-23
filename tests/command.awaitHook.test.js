/* eslint 'jest/expect-expect': [
  'warn',
  {
    assertFunctionNames: ['expect', 'testWithArguments', 'testWithOptions']
  }
] */

const commander = require('../');

const makeThenable = (function() {
  const cache = new Map();
  return (value) => {
    if (cache.has(value)) {
      return cache.get(value);
    }
    const thenable = {
      then: (fn) => makeThenable(fn(value))
    };
    cache.set(value, thenable);
    return thenable;
  };
})();

const chainedAwaited = async(coercion, args) => (
  args.reduce(async(promise, v) => {
    const { thenable } = await promise;
    return { thenable: makeThenable(coercion(v, await thenable)) };
  }, { thenable: makeThenable(undefined) })
);

describe('awaitHook with arguments', () => {
  async function testWithArguments(program, args, resolvedValues, awaited) {
    let actionValues;
    program
      .action((...args) => {
        actionValues = args.slice(0, resolvedValues.length);
      });

    const result = program.parseAsync(args, { from: 'user' });
    awaited.forEach((value, i) => {
      expect(program.processedArgs[i]).toBe(value);
    });
    await result;
    expect(program.processedArgs).toEqual(resolvedValues);
    expect(actionValues).toEqual(resolvedValues);
  }

  test('when awaitHook and arguments with custom processing then .processedArgs and action arguments resolved from callback', async() => {
    const args = ['1', '2'];
    const resolvedValues = [3, 4];
    const awaited = [
      makeThenable(resolvedValues[0]),
      resolvedValues[1]
    ];
    const mockCoercions = awaited.map(
      value => jest.fn().mockImplementation(() => value)
    );

    const program = new commander.Command();
    program
      .argument('<arg>', 'desc', mockCoercions[0])
      .argument('[arg]', 'desc', mockCoercions[1]);

    await testWithArguments(program, args, resolvedValues, awaited);
  });

  test('when awaitHook and arguments not specified with default values then .processedArgs and action arguments resolved from default values', async() => {
    const args = [];
    const resolvedValues = [1, 2];
    const awaited = [
      makeThenable(resolvedValues[0]),
      resolvedValues[1]
    ];

    const program = new commander.Command();
    program
      .argument('[arg]', 'desc', awaited[0])
      .argument('[arg]', 'desc', awaited[1]);

    await testWithArguments(program, args, resolvedValues, awaited);
  });

  test('when awaitHook and variadic argument with chained asynchronous custom processing then .processedArgs and action arguments resolved from chain', async() => {
    const args = ['1', '2'];
    const resolvedValues = ['12'];
    const coercion = (value, previousValue) => {
      const coerced = previousValue === undefined
        ? value
        : previousValue + value;
      return makeThenable(coerced);
    };
    const awaited = [(await chainedAwaited(coercion, args)).thenable];
    const mockCoercion = jest.fn().mockImplementation(coercion);

    const argument = new commander.Argument('<arg...>', 'desc')
      .argParser(mockCoercion)
      .chainArgParserCalls();

    const program = new commander.Command();
    program
      .addArgument(argument);

    await testWithArguments(program, args, resolvedValues, awaited);
  });
});

describe('awaitHook with options', () => {
  async function testWithOptions(program, args, resolvedValues, awaited) {
    program
      .action(() => {});

    const result = program.parseAsync(args, { from: 'user' });
    Object.entries(awaited).forEach(([key, value]) => {
      expect(program.opts()[key]).toBe(value);
    });
    await result;
    expect(program.opts()).toEqual(resolvedValues);
  }

  test('when awaitHook and options with custom processing then .opts() resolved from callback', async() => {
    const args = ['-a', '1', '-b', '2'];
    const resolvedValues = { a: 3, b: 4 };
    const awaited = {
      a: makeThenable(resolvedValues.a),
      b: resolvedValues.b
    };
    const mockCoercions = Object.entries(awaited).reduce((acc, [key, value]) => {
      acc[key] = jest.fn().mockImplementation(() => value);
      return acc;
    }, {});

    const program = new commander.Command();
    program
      .option('-a <arg>', 'desc', mockCoercions.a)
      .option('-b [arg]', 'desc', mockCoercions.b);

    await testWithOptions(program, args, resolvedValues, awaited);
    expect(program.getOptionValueSource('a')).toEqual('cli');
    expect(program.getOptionValueSource('b')).toEqual('cli');
  });

  test('when awaitHook and options not specified with default values then .opts() resolved from default values', async() => {
    const args = [];
    const resolvedValues = { a: 1, b: 2 };
    const awaited = {
      a: makeThenable(resolvedValues.a),
      b: resolvedValues.b
    };

    const program = new commander.Command();
    program
      .option('-a <arg>', 'desc', awaited.a)
      .option('-b [arg]', 'desc', awaited.b);

    await testWithOptions(program, args, resolvedValues, awaited);
    expect(program.getOptionValueSource('a')).toEqual('default');
    expect(program.getOptionValueSource('b')).toEqual('default');
  });

  test('when awaitHook and implied option values then .opts() resolved from implied values', async() => {
    const args = ['-c'];
    const resolvedValues = { a: 1, b: 2, c: true };
    const awaited = {
      a: makeThenable(resolvedValues.a),
      b: resolvedValues.b,
      c: true
    };

    const option = new commander.Option('-c').implies(awaited);
    const program = new commander.Command();
    program
      .option('-a <arg>')
      .option('-b [arg]')
      .addOption(option);

    await testWithOptions(program, args, resolvedValues, awaited);
    expect(program.getOptionValueSource('a')).toEqual('implied');
    expect(program.getOptionValueSource('b')).toEqual('implied');
  });

  test('when awaitHook and non-variadic repeated option with chained asynchronous custom processing then .opts() resolved from chain', async() => {
    const args = ['-a', '1', '-a', '2'];
    const resolvedValues = { a: '12' };
    const coercion = (value, previousValue) => {
      const coerced = previousValue === undefined
        ? value
        : previousValue + value;
      return makeThenable(coerced);
    };
    const awaited = {
      a: (await chainedAwaited(
        coercion, args.filter((_, i) => i % 2))
      ).thenable
    };
    const mockCoercion = jest.fn().mockImplementation(coercion);

    const option = new commander.Option('-a [arg]', 'desc')
      .argParser(mockCoercion)
      .chainArgParserCalls();

    const program = new commander.Command();
    program
      .addOption(option);

    await testWithOptions(program, args, resolvedValues, awaited);
    expect(program.getOptionValueSource('a')).toEqual('cli');
  });

  test('when awaitHook and variadic option with chained asynchronous custom processing then .opts() resolved from chain', async() => {
    const args = ['-a', '1', '2'];
    const resolvedValues = { a: '12' };
    const coercion = (value, previousValue) => {
      const coerced = previousValue === undefined
        ? value
        : previousValue + value;
      return makeThenable(coerced);
    };
    const awaited = {
      a: (await chainedAwaited(
        coercion, args.slice(1))
      ).thenable
    };
    const mockCoercion = jest.fn().mockImplementation(coercion);

    const option = new commander.Option('-a <arg...>', 'desc')
      .argParser(mockCoercion)
      .chainArgParserCalls();

    const program = new commander.Command();
    program
      .addOption(option);

    await testWithOptions(program, args, resolvedValues, awaited);
    expect(program.getOptionValueSource('a')).toEqual('cli');
  });

  test('when awaitHook with subcommand and options with custom processing then global .opts() resolved from callback before local option-argument parser is called', async() => {
    const arr = [];

    const coercion = (value) => {
      return new Promise((resolve) => {
        setImmediate(() => {
          arr.push(value);
          resolve(value);
        });
      });
    };
    const mockCoercion = jest.fn().mockImplementation(coercion);

    const syncCoercion = (value) => {
      arr.push(value);
      return value;
    };
    const mockSyncCoercion = jest.fn().mockImplementation(syncCoercion);

    const program = new commander.Command();
    program
      .option('-a <arg>', 'desc', mockCoercion)
      .command('subcommand')
      .option('-b <arg>', 'desc', mockSyncCoercion)
      .action(() => {});

    const args = ['-a', '1', 'subcommand', '-b', '2'];
    await program.parseAsync(args, { from: 'user' });
    expect(arr).toEqual(['1', '2']);
  });
});
