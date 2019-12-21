var { Command } = require('../');

function createCommanderInstance(mockFn) {
  const subCmd = new Command()
    .name('sub_cmd')
    .option('-f, --force');
  subCmd
    .command('sub_sub_cmd')
    .option('-d, --delete')
    .action(mockFn);

  const root = new Command();
  root
    .option('-q, --quiet');
  root
    .useSubcommand(subCmd);

  return root;
}

// TESTS

test('should collect options from all 3 levels when all passed', () => {
  const actionMock = jest.fn();
  const program = createCommanderInstance(actionMock);

  program.parse(['node', 'test', 'sub_cmd', 'sub_sub_cmd', '-f', '-q', '-d']);

  expect(actionMock).toHaveBeenCalledTimes(1);
  expect(actionMock.mock.calls[0].length).toBe(1);
  expect(actionMock.mock.calls[0][0] instanceof Command).toBeTruthy();
  expect(actionMock.mock.calls[0][0].name()).toBe('sub_sub_cmd');
  expect(actionMock.mock.calls[0][0].collectAllOptions()).toEqual({
    quiet: true,
    force: true,
    delete: true
  });
});

test('should collect options from all 3 levels when just some passed', () => {
  const actionMock = jest.fn();
  const program = createCommanderInstance(actionMock);

  program.parse(['node', 'test', 'sub_cmd', 'sub_sub_cmd', '-q']);

  expect(actionMock).toHaveBeenCalledTimes(1);
  expect(actionMock.mock.calls[0].length).toBe(1);
  expect(actionMock.mock.calls[0][0] instanceof Command).toBeTruthy();
  expect(actionMock.mock.calls[0][0].name()).toBe('sub_sub_cmd');

  const allOpts = actionMock.mock.calls[0][0].collectAllOptions();
  expect(allOpts).toEqual({
    quiet: true,
    force: undefined,
    delete: undefined
  });
  // The attrs are enumerable, just undefined !
  expect(Object.keys(allOpts).sort()).toEqual(['delete', 'force', 'quiet']);
});
