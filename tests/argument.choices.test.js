const commander = require('../');
const { createTestCommand } = require('./testHelpers');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Argument.choices()', () => {
  test('when command argument in choices then argument set', () => {
    const program = createTestCommand();
    let shade;
    program
      .addArgument(new commander.Argument('<shade>').choices(['red', 'blue']))
      .action((shadeParam) => {
        shade = shadeParam;
      });
    program.parse(['red'], { from: 'user' });
    assert.equal(shade, 'red');
  });

  test('when command argument is not in choices then error', () => {
    // Lightweight check, more detailed testing of behaviour in command.exitOverride.test.js
    const program = createTestCommand();
    program.addArgument(
      new commander.Argument('<shade>').choices(['red', 'blue']),
    );
    assert.throws(() => {
      program.parse(['orange'], { from: 'user' });
    });
  });
});

describe('Argument.choices() parameter is treated as readonly, per TypeScript declaration', () => {
  test('when choices called then parameter does not change', () => {
    // Unlikely this could break, but check the API we are declaring in TypeScript.
    const original = ['red', 'blue', 'green'];
    const param = original.slice();
    new commander.Argument('<shade>').choices(param);
    assert.deepEqual(param, original);
  });

  test('when choices called and argChoices later changed then parameter does not change', () => {
    const original = ['red', 'blue', 'green'];
    const param = original.slice();
    const argument = new commander.Argument('<shade>').choices(param);
    argument.argChoices.push('purple');
    assert.deepEqual(param, original);
  });

  test('when choices called and parameter changed the choices does not change', () => {
    const program = createTestCommand();
    const param = ['red', 'blue'];
    program.addArgument(new commander.Argument('<shade>').choices(param));
    param.push('orange');
    assert.throws(() => {
      program.parse(['orange'], { from: 'user' });
    });
  });
});
