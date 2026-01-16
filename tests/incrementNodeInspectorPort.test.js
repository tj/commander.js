import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import * as path from 'path';
import * as commander from '../index.js';

// Import child_process via CommonJS so node:test can mock childProcess.spawn without relying
// on Node.js experimental ESM mocking/loader features that would otherwise be needed to mock
// a direct ESM import.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const childProcess = require('node:child_process'); // CJS object, properties configurable

const __dirname = import.meta.dirname;

describe('increment node inspector port in executable subcommands', () => {
  function makeSpies(t) {
    const spawnSpy = t.mock.method(childProcess, 'spawn', () => {
      return {
        on: () => {},
      };
    });
    const signalSpy = test.mock.method(process, 'on', () => {});
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
