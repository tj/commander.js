const { test, describe, before, afterEach, after } = require('node:test');
const assert = require('node:assert/strict');
const childProcess = require('child_process');
const path = require('path');
const commander = require('../');

describe('incrementNodeInspectorPort', () => {
  function makeSpies(t) {
    const spawnSpy = t.mock.method(childProcess, 'spawn', () => {
      return {
        on: () => {},
      };
    });
    signalSpy = test.mock.method(process, 'on', () => {});
    return { spawnSpy, signalSpy };
  }

  const oldExecArgv = process.execArgv;

  after(() => {
    process.execArgv = oldExecArgv;
  });

  function makeProgram() {
    const program = new commander.Command();
    const fileWhichExists = path.join(__dirname, './fixtures/pm-cache.js');
    program.command('cache', 'stand-alone command', {
      executableFile: fileWhichExists,
    });
    return program;
  }

  function extractMockExecArgs(spawnSpy) {
    return spawnSpy.mock.calls[0].arguments[1].slice(0, -1);
  }

  test('when --inspect then bump port', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--inspect'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--inspect=127.0.0.1:9230']);
  });

  test('when --inspect=100 then bump port', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--inspect=100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--inspect=127.0.0.1:101']);
  });

  test('when --inspect=1.2.3.4:100 then bump port', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--inspect=1.2.3.4:100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--inspect=1.2.3.4:101']);
  });

  test('when --inspect=1.2.3.4 then bump port', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--inspect=1.2.3.4'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--inspect=1.2.3.4:9230']);
  });

  test('when --inspect-brk then bump port', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--inspect-brk'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--inspect-brk=127.0.0.1:9230']);
  });

  test('when --inspect-brk=100 then bump port', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--inspect-brk=100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--inspect-brk=127.0.0.1:101']);
  });

  test('when --inspect-brk=1.2.3.4 then bump port', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--inspect-brk=1.2.3.4'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--inspect-brk=1.2.3.4:9230']);
  });

  test('when --inspect-brk=1.2.3.4:100 then bump port', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--inspect-brk=1.2.3.4:100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--inspect-brk=1.2.3.4:101']);
  });

  test('when --inspect-port=100 then bump port', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--inspect-port=100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--inspect-port=127.0.0.1:101']);
  });

  test('when --inspect-port=1.2.3.4:100 then bump port', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--inspect-port=1.2.3.4:100'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--inspect-port=1.2.3.4:101']);
  });

  test('when --inspect-unexpected then unchanged', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--inspect-unexpected'];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--inspect-unexpected']);
  });

  test('when --frozen-intrinsics  then unchanged', (t) => {
    const { spawnSpy } = makeSpies(t);
    const program = makeProgram();
    process.execArgv = ['--frozen-intrinsics '];
    program.parse(['node', 'test', 'cache']);
    const execArgs = extractMockExecArgs(spawnSpy);
    assert.deepEqual(execArgs, ['--frozen-intrinsics ']);
  });
});
