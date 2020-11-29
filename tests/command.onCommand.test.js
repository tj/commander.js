const commander = require('../');

// The action handler used to be implemented using command events and listeners.
// Now, this is mostly just for backwards compatibility.

describe(".command('*')", () => {
  test('when action handler for subcommand then emit command:subcommand', () => {
    const mockListener = jest.fn();
    const program = new commander.Command();
    program
      .command('sub')
      .action(() => {});
    program.on('command:sub', mockListener);
    program.parse(['sub'], { from: 'user' });
    expect(mockListener).toHaveBeenCalled();
  });

  test('when no action handler for subcommand then still emit command:subcommand', () => {
    const mockListener = jest.fn();
    const program = new commander.Command();
    program
      .command('sub');
    program.on('command:sub', mockListener);
    program.parse(['sub'], { from: 'user' });
    expect(mockListener).toHaveBeenCalled();
  });

  test('when subcommand has argument then emit command:subcommand with argument', () => {
    const mockListener = jest.fn();
    const program = new commander.Command();
    program
      .command('sub <file>')
      .action(() => {});
    program.on('command:sub', mockListener);
    program.parse(['sub', 'file'], { from: 'user' });
    expect(mockListener).toHaveBeenCalledWith(['file'], []);
  });
});
