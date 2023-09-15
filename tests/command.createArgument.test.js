const commander = require('../');

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
  expect(program.registeredArguments.length).toEqual(1);
  expect(program.registeredArguments[0].myProperty).toEqual('MyArgument');
});

test('when override createArgument then used for arguments()', () => {
  const program = new MyCommand();
  program.arguments('<file>');
  expect(program.registeredArguments.length).toEqual(1);
  expect(program.registeredArguments[0].myProperty).toEqual('MyArgument');
});

test('when override createArgument and createCommand then used for argument of command()', () => {
  const program = new MyCommand();
  const sub = program.command('sub <file>');
  expect(sub.registeredArguments.length).toEqual(1);
  expect(sub.registeredArguments[0].myProperty).toEqual('MyArgument');
});
