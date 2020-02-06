const commander = require('../');

// .command('*') is the old main/default command handler. It adds a listener
// for 'command:*'. It has been somewhat replaced by the program action handler,
// so most uses are probably old code. Current plan is keep the code backwards compatible
// and put work in elsewhere for new code (e.g. evolving behaviour for program action handler).
//
// The event 'command:*' is also listened for directly for testing for unknown commands
// due to an example in the README.
//
// Historical: the event 'command:*' used to also be shared by the action handler on the program.

describe(".command('*')", () => {
  // Use internal knowledge to suppress output to keep test output clean.
  let writeMock;

  beforeAll(() => {
    writeMock = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  });

  afterAll(() => {
    writeMock.mockRestore();
  });

  test('when no arguments then asterisk action not called', () => {
    const mockAction = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride() // to catch help
      .command('*')
      .action(mockAction);
    try {
      program.parse(['node', 'test']);
    } catch (err) {
      ;
    }
    expect(mockAction).not.toHaveBeenCalled();
  });

  test('when unrecognised argument then asterisk action called', () => {
    const mockAction = jest.fn();
    const program = new commander.Command();
    program
      .command('*')
      .action(mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    expect(mockAction).toHaveBeenCalled();
  });

  test('when recognised command then asterisk action not called', () => {
    const mockAction = jest.fn();
    const program = new commander.Command();
    program
      .command('install')
      .action(() => { });
    program
      .command('*')
      .action(mockAction);
    program.parse(['node', 'test', 'install']);
    expect(mockAction).not.toHaveBeenCalled();
  });

  test('when unrecognised command/argument then asterisk action called', () => {
    const mockAction = jest.fn();
    const program = new commander.Command();
    program
      .command('install');
    program
      .command('*')
      .action(mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    expect(mockAction).toHaveBeenCalled();
  });
});

// Test .on explicitly rather than assuming covered by .command
describe(".on('command:*')", () => {
  test('when no arguments then listener not called', () => {
    const mockAction = jest.fn();
    const program = new commander.Command();
    program
      .on('command:*', mockAction);
    program.parse(['node', 'test']);
    expect(mockAction).not.toHaveBeenCalled();
  });

  test('when unrecognised argument then listener called', () => {
    const mockAction = jest.fn();
    const program = new commander.Command();
    program
      .on('command:*', mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    expect(mockAction).toHaveBeenCalled();
  });

  test('when recognised command then listener not called', () => {
    const mockAction = jest.fn();
    const program = new commander.Command();
    program
      .command('install')
      .action(() => { });
    program
      .on('command:*', mockAction);
    program.parse(['node', 'test', 'install']);
    expect(mockAction).not.toHaveBeenCalled();
  });

  test('when unrecognised command/argument then listener called', () => {
    const mockAction = jest.fn();
    const program = new commander.Command();
    program
      .command('install');
    program
      .on('command:*', mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    expect(mockAction).toHaveBeenCalled();
  });
});
