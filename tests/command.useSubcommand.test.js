var { Command } = require('../');

function createCommanderInstance(mockFn) {
  const cmd2 = new Command()
    .name('cmd2');
  cmd2
    .command('subCmd')
    .action(mockFn);

  const cmd3 = new Command()
    .name('cmd3')
    .option('-q, --quiet');
  cmd3
    .command('subWithOpt')
    .option('-f, --force')
    .action(mockFn);
  cmd3
    .command('subWithParam <param>')
    .action(mockFn);

  const root = new Command();
  root
    .command('cmd1')
    .action(mockFn);
  root
    .useSubcommand(cmd2)
    .useSubcommand(cmd3);

  return root;
}

// TESTS

test('should envoke 1 level command', () => {
  const actionMock = jest.fn();
  const program = createCommanderInstance(actionMock);

  program.parse(['node', 'test', 'cmd1']);

  expect(actionMock).toHaveBeenCalledTimes(1);
  expect(actionMock.mock.calls[0].length).toBe(1);
  expect(actionMock.mock.calls[0][0] instanceof Command).toBeTruthy();
  expect(actionMock.mock.calls[0][0].name()).toBe('cmd1');
});

test('should envoke 2 level sub command', () => {
  const actionMock = jest.fn();
  const program = createCommanderInstance(actionMock);

  program.parse(['node', 'test', 'cmd2', 'subCmd']);

  expect(actionMock).toHaveBeenCalledTimes(1);
  expect(actionMock.mock.calls[0].length).toBe(1);
  expect(actionMock.mock.calls[0][0] instanceof Command).toBeTruthy();
  expect(actionMock.mock.calls[0][0].name()).toBe('subCmd');
});

test('should envoke 2 level sub command with subcommand options', () => {
  const actionMock = jest.fn();
  const program = createCommanderInstance(actionMock);

  program.parse(['node', 'test', 'cmd3', 'subWithOpt']);

  expect(actionMock).toHaveBeenCalledTimes(1);
  expect(actionMock.mock.calls[0].length).toBe(1);
  expect(actionMock.mock.calls[0][0] instanceof Command).toBeTruthy();
  expect(actionMock.mock.calls[0][0].name()).toBe('subWithOpt');
  expect(actionMock.mock.calls[0][0].force).toBeFalsy();

  actionMock.mockReset();
  program.parse(['node', 'test', 'cmd3', 'subWithOpt', '-f']);

  expect(actionMock).toHaveBeenCalledTimes(1);
  expect(actionMock.mock.calls[0].length).toBe(1);
  expect(actionMock.mock.calls[0][0] instanceof Command).toBeTruthy();
  expect(actionMock.mock.calls[0][0].name()).toBe('subWithOpt');
  expect(actionMock.mock.calls[0][0].force).toBeTruthy();
});

test('should envoke 2 level sub command with with subcommand param', () => {
  const actionMock = jest.fn();
  const program = createCommanderInstance(actionMock);

  program.parse(['node', 'test', 'cmd3', 'subWithParam', 'theparam']);

  expect(actionMock).toHaveBeenCalledTimes(1);
  expect(actionMock.mock.calls[0].length).toBe(2);
  expect(actionMock.mock.calls[0][0]).toBe('theparam');
  expect(actionMock.mock.calls[0][1] instanceof Command).toBeTruthy();
  expect(actionMock.mock.calls[0][1].name()).toBe('subWithParam');
});

test('should envoke 2 level sub command with options on several levels', () => {
  const actionMock = jest.fn();
  const program = createCommanderInstance(actionMock);

  // -f belongs to subWithOpt, -q belongs to cmd3
  program.parse(['node', 'test', 'cmd3', 'subWithOpt', '-f', '-q']);

  expect(actionMock).toHaveBeenCalledTimes(1);
  expect(actionMock.mock.calls[0].length).toBe(1);
  expect(actionMock.mock.calls[0][0] instanceof Command).toBeTruthy();
  expect(actionMock.mock.calls[0][0].name()).toBe('subWithOpt');
  expect(actionMock.mock.calls[0][0].force).toBeTruthy();
  expect(actionMock.mock.calls[0][0].quiet).toBeUndefined();
  expect(actionMock.mock.calls[0][0].parent.quiet).toBeTruthy();
});
