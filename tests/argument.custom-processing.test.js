const commander = require('../');

// Testing default value and custom processing behaviours.

test('when argument not specified then callback not called', () => {
  const mockCoercion = jest.fn();
  const program = new commander.Command();
  program
    .argument('[n]', 'number', mockCoercion)
    .action(() => {});
  program.parse([], { from: 'user' });
  expect(mockCoercion).not.toHaveBeenCalled();
});

test('when argument not specified then action argument undefined', () => {
  let actionValue = 'foo';
  const program = new commander.Command();
  program
    .argument('[n]', 'number', parseFloat)
    .action((arg) => {
      actionValue = arg;
    });
  program.parse([], { from: 'user' });
  expect(actionValue).toBeUndefined();
});

test('when custom with starting value and argument not specified then callback not called', () => {
  const mockCoercion = jest.fn();
  const program = new commander.Command();
  program
    .argument('[n]', 'number', parseFloat, 1)
    .action(() => {});
  program.parse([], { from: 'user' });
  expect(mockCoercion).not.toHaveBeenCalled();
});

test('when custom with starting value and argument not specified then action argument is starting value', () => {
  const startingValue = 1;
  let actionValue;
  const program = new commander.Command();
  program
    .argument('[n]', 'number', parseFloat, startingValue)
    .action((arg) => {
      actionValue = arg;
    });
  program.parse([], { from: 'user' });
  expect(actionValue).toEqual(startingValue);
});

test('when default value is defined (without custom processing) and argument not specified then action argument is default value', () => {
  const defaultValue = 1;
  let actionValue;
  const program = new commander.Command();
  program
    .argument('[n]', 'number', defaultValue)
    .action((arg) => {
      actionValue = arg;
    });
  program.parse([], { from: 'user' });
  expect(actionValue).toEqual(defaultValue);
});

test('when argument specified then callback called with value', () => {
  const mockCoercion = jest.fn();
  const value = '1';
  const program = new commander.Command();
  program
    .argument('[n]', 'number', mockCoercion)
    .action(() => {});
  program.parse([value], { from: 'user' });
  expect(mockCoercion).toHaveBeenCalledWith(value, undefined);
});

test('when argument specified then action value is as returned from callback', () => {
  const callbackResult = 2;
  let actionValue;
  const program = new commander.Command();
  program
    .argument('[n]', 'number', () => {
      return callbackResult;
    })
    .action((arg) => {
      actionValue = arg;
    });
  program.parse(['node', 'test', 'alpha']);
  expect(actionValue).toEqual(callbackResult);
});

test('when argument specified then program.args has original rather than custom', () => {
  // This is as intended, so check behaviour.
  const callbackResult = 2;
  const program = new commander.Command();
  program
    .argument('[n]', 'number', () => {
      return callbackResult;
    })
    .action(() => {});
  program.parse(['node', 'test', 'alpha']);
  expect(program.args).toEqual(['alpha']);
});

test('when custom with starting value and argument specified then callback called with value and starting value', () => {
  const mockCoercion = jest.fn();
  const startingValue = 1;
  const value = '2';
  const program = new commander.Command()
    .argument('[n]', 'number', mockCoercion, startingValue)
    .action(() => {});
  program.parse(['node', 'test', value]);
  expect(mockCoercion).toHaveBeenCalledWith(value, startingValue);
});

test('when variadic argument specified multiple times then callback called with value and previousValue', () => {
  const mockCoercion = jest.fn().mockImplementation(() => {
    return 'callback';
  });
  const program = new commander.Command();
  program
    .argument('<n...>', 'number', mockCoercion)
    .action(() => {});
  program.parse(['1', '2'], { from: 'user' });
  expect(mockCoercion).toHaveBeenCalledTimes(2);
  expect(mockCoercion).toHaveBeenNthCalledWith(1, '1', undefined);
  expect(mockCoercion).toHaveBeenNthCalledWith(2, '2', 'callback');
});

test('when parseFloat "1e2" then action argument is 100', () => {
  let actionValue;
  const program = new commander.Command();
  program
    .argument('<number>', 'float argument', parseFloat)
    .action((arg) => {
      actionValue = arg;
    });
  program.parse(['1e2'], { from: 'user' });
  expect(actionValue).toEqual(100);
});

test('when defined default value for required argument then throw', () => {
  const program = new commander.Command();
  expect(() => {
    program.argument('<number>', 'float argument', 4);
  }).toThrow();
});
