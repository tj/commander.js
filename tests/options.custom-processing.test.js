const commander = require('../');

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  return parseInt(value, 10);
}

function increaseVerbosity(dummyValue, previous) {
  return previous + 1;
}

function collect(value, previous) {
  return previous.concat([value]);
}

function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}

test('when option not specified then callback not called', () => {
  const mockCoercion = jest.fn();
  const program = new commander.Command();
  program
    .option('-i, --integer <n>', 'number', mockCoercion);
  program.parse(['node', 'test']);
  expect(mockCoercion).not.toHaveBeenCalled();
});

test('when option not specified then value is undefined', () => {
  const program = new commander.Command();
  program
    .option('-i, --integer <n>', 'number', myParseInt);
  program.parse(['node', 'test']);
  expect(program.opts().integer).toBeUndefined();
});

test('when starting value is defined and option not specified then callback not called', () => {
  const mockCoercion = jest.fn();
  const program = new commander.Command();
  program
    .option('-i, --integer <n>', 'number', mockCoercion, 1);
  program.parse(['node', 'test']);
  expect(mockCoercion).not.toHaveBeenCalled();
});

test('when starting value is defined and option not specified then value is starting value', () => {
  // NB: Can not specify a starting value for a boolean flag! Discovered when writing this test...
  const startingValue = 1;
  const program = new commander.Command();
  program
    .option('-i, --integer <n>', 'number', myParseInt, startingValue);
  program.parse(['node', 'test']);
  expect(program.opts().integer).toBe(startingValue);
});

test('when option specified then callback called with value', () => {
  const mockCoercion = jest.fn();
  const value = '1';
  const program = new commander.Command();
  program
    .option('-i, --integer <n>', 'number', mockCoercion);
  program.parse(['node', 'test', '-i', value]);
  expect(mockCoercion).toHaveBeenCalledWith(value, undefined);
});

test('when option specified then value is as returned from callback', () => {
  const callbackResult = 2;
  const program = new commander.Command();
  program
    .option('-i, --integer <n>', 'number', () => {
      return callbackResult;
    });
  program.parse(['node', 'test', '-i', '0']);
  expect(program.opts().integer).toBe(callbackResult);
});

test('when starting value is defined and option specified then callback called with value and starting value', () => {
  const mockCoercion = jest.fn();
  const startingValue = 1;
  const value = '2';
  const program = new commander.Command();
  program
    .option('-i, --integer <n>', 'number', mockCoercion, startingValue);
  program.parse(['node', 'test', '-i', value]);
  expect(mockCoercion).toHaveBeenCalledWith(value, startingValue);
});

test('when option specified multiple times then callback called with value and previousValue', () => {
  const mockCoercion = jest.fn().mockImplementation(() => {
    return 'callback';
  });
  const program = new commander.Command();
  program
    .option('-i, --integer <n>', 'number', mockCoercion);
  program.parse(['node', 'test', '-i', '1', '-i', '2']);
  expect(mockCoercion).toHaveBeenCalledTimes(2);
  expect(mockCoercion).toHaveBeenNthCalledWith(1, '1', undefined);
  expect(mockCoercion).toHaveBeenNthCalledWith(2, '2', 'callback');
});

// Now some functional tests like the examples in the README!

test('when parseFloat "1e2" then value is 100', () => {
  const program = new commander.Command();
  program
    .option('-f, --float <number>', 'float argument', parseFloat);
  program.parse(['node', 'test', '-f', '1e2']);
  expect(program.opts().float).toBe(100);
});

test('when myParseInt "1" then value is 1', () => {
  const program = new commander.Command();
  program
    .option('-i, --integer <number>', 'integer argument', myParseInt);
  program.parse(['node', 'test', '-i', '1']);
  expect(program.opts().integer).toBe(1);
});

test('when increaseVerbosity -v -v -v then value is 3', () => {
  const program = new commander.Command();
  program
    .option('-v, --verbose', 'verbosity that can be increased', increaseVerbosity, 0);
  program.parse(['node', 'test', '-v', '-v', '-v']);
  expect(program.opts().verbose).toBe(3);
});

test('when collect -c a -c b -c c then value is [a, b, c]', () => {
  const program = new commander.Command();
  program
    .option('-c, --collect <value>', 'repeatable value', collect, []);
  program.parse(['node', 'test', '-c', 'a', '-c', 'b', '-c', 'c']);
  expect(program.opts().collect).toEqual(['a', 'b', 'c']);
});

test('when commaSeparatedList x,y,z then value is [x, y, z]', () => {
  const program = new commander.Command();
  program
    .option('-l, --list <items>', 'comma separated list', commaSeparatedList);
  program.parse(['node', 'test', '--list', 'x,y,z']);
  expect(program.opts().list).toEqual(['x', 'y', 'z']);
});

test('when custom non-variadic repeated with .chainArgParserCalls() then parsed to chain', async() => {
  const args = ['-a', '1', '-a', '2'];
  const resolvedValue = '12';
  const coercion = async(value, previousValue) => (
    previousValue === undefined ? value : previousValue + value
  );
  const awaited = coercion(args[1], undefined);
  const mockCoercion = jest.fn().mockImplementation(coercion);

  const option = new commander.Option('-a <arg...>', 'desc')
    .argParser(mockCoercion)
    .chainArgParserCalls();

  const program = new commander.Command();
  program
    .addOption(option)
    .action(() => {});

  program.parse(args, { from: 'user' });
  expect(program.opts()).toEqual({ a: awaited });
  await expect(program.opts().a).resolves.toEqual(resolvedValue);
});

test('when custom variadic with .chainArgParserCalls() then parsed to chain', async() => {
  const args = ['-a', '1', '2'];
  const resolvedValue = '12';
  const coercion = async(value, previousValue) => (
    previousValue === undefined ? value : previousValue + value
  );
  const awaited = coercion(args[1], undefined);
  const mockCoercion = jest.fn().mockImplementation(coercion);

  const option = new commander.Option('-a <arg...>', 'desc')
    .argParser(mockCoercion)
    .chainArgParserCalls();

  const program = new commander.Command();
  program
    .addOption(option)
    .action(() => {});

  program.parse(args, { from: 'user' });
  expect(program.opts()).toEqual({ a: awaited });
  await expect(program.opts().a).resolves.toEqual(resolvedValue);
});
