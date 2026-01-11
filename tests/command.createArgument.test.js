const commander = require('../');
const { test } = require('node:test');
const assert = require('node:assert/strict');

class MyArgument extends commander.Argument {
  constructor(name, description) {
    super(name, description);
    this.myProperty = 'MyArgument';
  }
}

class MyCommand extends commander.Command {
  createArgument(name, description) {
    return new MyArgument(name, description);
  }

  // createCommand for testing .command('sub <file>')
  createCommand(name) {
    return new MyCommand(name);
  }
}

test('when override createArgument then used for argument()', () => {
  const program = new MyCommand();
  program.argument('<file>');
  assert.equal(program.registeredArguments.length, 1);
  assert.equal(program.registeredArguments[0].myProperty, 'MyArgument');
});

test('when override createArgument then used for arguments()', () => {
  const program = new MyCommand();
  program.arguments('<file>');
  assert.equal(program.registeredArguments.length, 1);
  assert.equal(program.registeredArguments[0].myProperty, 'MyArgument');
});

test('when override createArgument and createCommand then used for argument of command()', () => {
  const program = new MyCommand();
  const sub = program.command('sub <file>');
  assert.equal(sub.registeredArguments.length, 1);
  assert.equal(sub.registeredArguments[0].myProperty, 'MyArgument');
});
