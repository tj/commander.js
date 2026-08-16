import { Command } from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Command.apply', () => {
  test('when call .apply() with function then returns this', () => {
    const program = new Command();
    const result = program.apply(() => {});
    assert.equal(result, program);
  });

  test('when call .apply() then function is called with command', () => {
    const program = new Command();
    let receivedCommand = null;
    program.apply((cmd) => {
      receivedCommand = cmd;
    });
    assert.equal(receivedCommand, program);
  });

  test('when call .apply() then function can configure command', () => {
    const program = new Command();
    program.apply((cmd) => {
      cmd
        .description('test description')
        .option('-v, --verbose', 'verbose output');
    });
    assert.equal(program.description(), 'test description');
    assert.ok(program.options.find((o) => o.short === '-v'));
  });

  test('when call .apply() multiple times then functions are all called', () => {
    const program = new Command();
    const callOrder = [];
    program
      .apply(() => {
        callOrder.push(1);
      })
      .apply(() => {
        callOrder.push(2);
      })
      .apply(() => {
        callOrder.push(3);
      });
    assert.deepEqual(callOrder, [1, 2, 3]);
  });

  test('when call .apply() then can be chained with other methods', () => {
    const program = new Command();
    const result = program
      .description('before')
      .apply((cmd) => {
        cmd.description('after');
      })
      .option('-f, --flag', 'a flag');
    assert.equal(result, program);
    assert.equal(program.description(), 'after');
  });
});
