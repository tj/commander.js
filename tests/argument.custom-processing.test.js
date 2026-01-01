const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Testing default value and custom processing behaviours.
// Some double assertions in tests to check action argument and .processedArg

test('when argument not specified then callback not called', (t) => {
  const mockCoercion = t.mock.fn();
  const program = new commander.Command();
  program.argument('[n]', 'number', mockCoercion).action(() => {});
  program.parse([], { from: 'user' });
  assert.equal(mockCoercion.mock.callCount(), 0);
});

test('when argument not specified then action argument undefined', () => {
  let actionValue = 'foo';
  const program = new commander.Command();
  program.argument('[n]', 'number', parseFloat).action((arg) => {
    actionValue = arg;
  });
  program.parse([], { from: 'user' });
  assert.equal(actionValue, undefined);
});

test('when custom with starting value and argument not specified then callback not called', (t) => {
  const mockCoercion = t.mock.fn();
  const program = new commander.Command();
  program.argument('[n]', 'number', parseFloat, 1).action(() => {});
  program.parse([], { from: 'user' });
  assert.equal(mockCoercion.mock.callCount(), 0);
});

test('when custom with starting value and argument not specified with action handler then action argument is starting value', () => {
  const startingValue = 1;
  let actionValue;
  const program = new commander.Command();
  program.argument('[n]', 'number', parseFloat, startingValue).action((arg) => {
    actionValue = arg;
  });
  program.parse([], { from: 'user' });
  assert.equal(actionValue, startingValue);
  assert.deepEqual(program.processedArgs, [startingValue]);
});

test('when custom with starting value and argument not specified without action handler then .processedArgs has starting value', () => {
  const startingValue = 1;
  const program = new commander.Command();
  program.argument('[n]', 'number', parseFloat, startingValue);
  program.parse([], { from: 'user' });
  assert.deepEqual(program.processedArgs, [startingValue]);
});

test('when default value is defined (without custom processing) and argument not specified with action handler then action argument is default value', () => {
  const defaultValue = 1;
  let actionValue;
  const program = new commander.Command();
  program.argument('[n]', 'number', defaultValue).action((arg) => {
    actionValue = arg;
  });
  program.parse([], { from: 'user' });
  assert.equal(actionValue, defaultValue);
  assert.deepEqual(program.processedArgs, [defaultValue]);
});

test('when default value is defined (without custom processing) and argument not specified without action handler then .processedArgs is default value', () => {
  const defaultValue = 1;
  const program = new commander.Command();
  program.argument('[n]', 'number', defaultValue);
  program.parse([], { from: 'user' });
  assert.deepEqual(program.processedArgs, [defaultValue]);
});

test('when argument specified then callback called with value', (t) => {
  const mockCoercion = t.mock.fn();
  const value = '1';
  const program = new commander.Command();
  program.argument('[n]', 'number', mockCoercion).action(() => {});
  program.parse([value], { from: 'user' });
  assert.deepEqual(mockCoercion.mock.calls[0].arguments, [value, undefined]);
});

test('when argument specified with action handler then action value is as returned from callback', () => {
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
  assert.equal(actionValue, callbackResult);
  assert.deepEqual(program.processedArgs, [callbackResult]);
});

test('when argument specified without action handler then .processedArgs is as returned from callback', () => {
  const callbackResult = 2;
  const program = new commander.Command();
  program.argument('[n]', 'number', () => {
    return callbackResult;
  });
  program.parse(['node', 'test', 'alpha']);
  assert.deepEqual(program.processedArgs, [callbackResult]);
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
  assert.deepEqual(program.args, ['alpha']);
});

test('when custom with starting value and argument specified then callback called with value and starting value', (t) => {
  const mockCoercion = t.mock.fn();
  const startingValue = 1;
  const value = '2';
  const program = new commander.Command()
    .argument('[n]', 'number', mockCoercion, startingValue)
    .action(() => {});
  program.parse(['node', 'test', value]);
  assert.deepEqual(mockCoercion.mock.calls[0].arguments, [
    value,
    startingValue,
  ]);
});

test('when variadic argument specified multiple times then callback called with value and previousValue', (t) => {
  const mockCoercion = t.mock.fn(() => {
    return 'callback';
  });
  const program = new commander.Command();
  program.argument('<n...>', 'number', mockCoercion).action(() => {});
  program.parse(['1', '2'], { from: 'user' });
  assert.equal(mockCoercion.mock.callCount(), 2);
  assert.deepEqual(mockCoercion.mock.calls[0].arguments, ['1', undefined]);
  assert.deepEqual(mockCoercion.mock.calls[1].arguments, ['2', 'callback']);
});

test('when variadic argument without action handler then .processedArg has array', () => {
  const program = new commander.Command();
  program.argument('<n...>', 'number');
  program.parse(['1', '2'], { from: 'user' });
  assert.deepEqual(program.processedArgs, [['1', '2']]);
});

test('when parseFloat "1e2" then action argument is 100', () => {
  let actionValue;
  const program = new commander.Command();
  program.argument('<number>', 'float argument', parseFloat).action((arg) => {
    actionValue = arg;
  });
  program.parse(['1e2'], { from: 'user' });
  assert.equal(actionValue, 100);
  assert.deepEqual(program.processedArgs, [actionValue]);
});

test('when defined default value for required argument then throw', () => {
  const program = new commander.Command();
  assert.throws(() => {
    program.argument('<number>', 'float argument', 4);
  });
});

test('when custom processing for argument throws plain error then not CommanderError caught', () => {
  function justSayNo(value) {
    throw new Error('plain error');
  }
  const program = new commander.Command();
  program
    .exitOverride()
    .argument('[n]', 'number', justSayNo)
    .action(() => {});

  assert.throws(
    () => {
      program.parse(['green'], { from: 'user' });
    },
    (err) => {
      assert.equal(err instanceof Error, true);
      assert.equal(err instanceof commander.CommanderError, false);
      return true;
    },
  );
});
