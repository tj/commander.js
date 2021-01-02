const childProcess = require('child_process');
const path = require('path');
const commander = require('../');

describe('incrementNodeInspectorPort', () => {
  let spawnSpy;
  const oldExecArgv = process.execArgv;

  beforeAll(() => {
    spawnSpy = jest.spyOn(childProcess, 'spawn').mockImplementation(() => {
      return {
        on: () => {}
      };
    });
  });

  afterEach(() => {
    spawnSpy.mockClear();
  });

  afterAll(() => {
    spawnSpy.mockRestore();
    process.execArgv = oldExecArgv;
  });

  function makeProgram() {
    const program = new commander.Command();
    const fileWhichExists = path.join(__dirname, './fixtures/pm-cache.js');
    program.command('cache', 'stand-alone command', { executableFile: fileWhichExists });
    return program;
  }

  function extractMockExecArgs(mock) {
    return mock.mock.calls[0][1].slice(0, -1);
  }

  test('when --inspect then bump port', () => {
    const program = makeProgram();
    process.execArgv = ['--inspect'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    expect(execArgs).toEqual(['--inspect=127.0.0.1:9230']);
  });

  test('when --inspect=100 then bump port', () => {
    const program = makeProgram();
    process.execArgv = ['--inspect=100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    expect(execArgs).toEqual(['--inspect=127.0.0.1:101']);
  });

  test('when --inspect=1.2.3.4:100 then bump port', () => {
    const program = makeProgram();
    process.execArgv = ['--inspect=1.2.3.4:100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    expect(execArgs).toEqual(['--inspect=1.2.3.4:101']);
  });

  test('when --inspect-brk then bump port', () => {
    const program = makeProgram();
    process.execArgv = ['--inspect-brk'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    expect(execArgs).toEqual(['--inspect-brk=127.0.0.1:9230']);
  });

  test('when --inspect-brk=100 then bump port', () => {
    const program = makeProgram();
    process.execArgv = ['--inspect-brk=100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    expect(execArgs).toEqual(['--inspect-brk=127.0.0.1:101']);
  });

  test('when --inspect-brk=1.2.3.4:100 then bump port', () => {
    const program = makeProgram();
    process.execArgv = ['--inspect-brk=1.2.3.4:100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    expect(execArgs).toEqual(['--inspect-brk=1.2.3.4:101']);
  });

  test('when --inspect-port=100 then bump port', () => {
    const program = makeProgram();
    process.execArgv = ['--inspect-port=100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    expect(execArgs).toEqual(['--inspect-port=127.0.0.1:101']);
  });

  test('when --inspect-port=1.2.3.4:100 then bump port', () => {
    const program = makeProgram();
    process.execArgv = ['--inspect-port=1.2.3.4:100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    expect(execArgs).toEqual(['--inspect-port=1.2.3.4:101']);
  });
});
