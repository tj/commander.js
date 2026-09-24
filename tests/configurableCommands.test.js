import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { createProgram } from '../examples/configurable-commands.js';

function parseWithError(program, args) {
  let errorOutput = '';
  program.exitOverride().configureOutput({
    writeErr: (message) => {
      errorOutput += message;
    },
  });
  assert.throws(() => program.parse(args, { from: 'user' }), {
    code: 'commander.unknownCommand',
  });
  return errorOutput;
}

describe('configurable command distributions', () => {
  test('selects commands and aliases for one distribution', () => {
    const output = [];
    const program = createProgram(
      new Set(['inspect', 'data', 'trace']),
      (message) => output.push(message),
    );

    assert.match(program.helpInformation(), /inspect\|i/);
    assert.match(program.helpInformation(), /data\|d/);
    assert.match(program.helpInformation(), /trace\|tr/);
    assert.doesNotMatch(program.helpInformation(), /chat/);
    assert.doesNotMatch(program.helpInformation(), /perf/);

    program.parse(['i'], { from: 'user' });
    program.parse(['d'], { from: 'user' });
    program.parse(['tr', 'span'], { from: 'user' });
    assert.deepEqual(output, ['inspect', 'data', 'trace span']);
  });

  test('selects a different distribution and nested commands', () => {
    const output = [];
    const program = createProgram(new Set(['data', 'trace']), (message) =>
      output.push(message),
    );

    assert.match(program.helpInformation(), /data\|d/);
    assert.match(program.helpInformation(), /trace\|tr/);
    assert.doesNotMatch(program.helpInformation(), /inspect/);
    assert.doesNotMatch(program.helpInformation(), /chat/);
    assert.doesNotMatch(program.helpInformation(), /perf/);

    program
      .exitOverride()
      .configureOutput({ writeOut: () => {}, writeErr: () => {} });
    assert.throws(() => program.parse(['trace', '--help'], { from: 'user' }), {
      code: 'commander.helpDisplayed',
    });
    const trace = program.commands.find(
      (command) => command.name() === 'trace',
    );
    assert.match(trace.helpInformation(), /span/);
    program.parse(['trace', 'span'], { from: 'user' });
    assert.deepEqual(output, ['trace span']);
  });

  test('excluded commands, aliases, and nested routes are unavailable', () => {
    const output = [];
    const program = createProgram(
      new Set(['inspect', 'data', 'trace']),
      (message) => output.push(message),
    );

    const errorOutputs = [
      ['chat'],
      ['c'],
      ['chat', '--help'],
      ['chat', 'send'],
      ['perf'],
      ['p', '--help'],
    ].map((args) => parseWithError(program, args));
    assert.ok(
      errorOutputs.every((errorOutput) =>
        errorOutput.includes('unknown command'),
      ),
    );
    assert.deepEqual(output, []);
  });

  test('suggests only selected commands', () => {
    const program = createProgram(new Set(['inspect', 'data', 'trace']));
    const dataSuggestion = parseWithError(program, ['dat']);
    assert.match(dataSuggestion, /Did you mean data\?/);

    const excludedProgram = createProgram(
      new Set(['inspect', 'data', 'trace']),
    );
    const chatSuggestion = parseWithError(excludedProgram, ['chatt']);
    assert.doesNotMatch(chatSuggestion, /Did you mean chat\?/);
  });
});
