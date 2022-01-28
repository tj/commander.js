const commander = require('../');

test('when createCommand then unattached', () => {
  const program = new commander.Command();
  const cmd = program.createCommand();
  expect(program.commands.length).toBe(0);
  expect(cmd.parent).toBeFalsy(); // (actually null, but use weaker test for unattached)
});

test('when subclass overrides createCommand then subcommand is subclass', () => {
  class MyClass extends commander.Command {
    constructor(name) {
      super();
      this.myProperty = 'myClass';
    }

    createCommand(name) {
      return new MyClass(name);
    }
  }
  const program = new MyClass();
  const sub = program.command('sub');
  expect(sub.myProperty).toEqual('myClass');
});

test('when override createCommand then subcommand is custom', () => {
  function createCustom(name) {
    const cmd = new commander.Command();
    cmd.myProperty = 'custom';
    return cmd;
  }
  const program = createCustom();
  program.createCommand = createCustom;
  const sub = program.command('sub');
  expect(sub.myProperty).toEqual('custom');
});
