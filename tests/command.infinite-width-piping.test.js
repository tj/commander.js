import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as commander from '../index.js';

describe('Infinite width when piping (#2508)', () => {
  test('when process.stdout.columns is undefined then helpWidth is Infinity (not 80)', () => {
    const program = new commander.Command();
    program
      .option('-d, --debug', 'enable debug mode with detailed logging output for troubleshooting purposes')
      .option('-v, --verbose', 'enable verbose output showing detailed information during execution');

    // Mock getOutHelpWidth to return undefined (simulating pipe scenario)
    const customProgram = program.configureOutput({
      getOutHelpWidth: () => undefined,
    });

    // Get the help output
    const helpOutput = customProgram.helpInformation();

    // When helpWidth is Infinity, descriptions should NOT be wrapped
    // The debug option description should remain on a single line after the option
    // If wrapped to 80, there would be line breaks in the description
    assert.match(helpOutput, /-d, --debug\s+enable debug mode with detailed logging output for troubleshooting purposes/);
    assert.match(helpOutput, /-v, --verbose\s+enable verbose output showing detailed information during execution/);
  });

  test('when process.stderr.columns is undefined then error helpWidth is Infinity', () => {
    const program = new commander.Command();
    program.option('-d, --debug', 'enable debug mode with detailed logging output for troubleshooting purposes');

    // Mock getErrHelpWidth to return undefined (simulating pipe scenario)
    const customProgram = program.configureOutput({
      getErrHelpWidth: () => undefined,
    });

    // Get the error help output
    const helpOutput = customProgram.helpInformation({ error: true });

    // Should not be wrapped
    assert.match(helpOutput, /-d, --debug\s+enable debug mode with detailed logging output for troubleshooting purposes/);
  });

  test('when helpWidth is Infinity then boxWrap returns string unchanged', () => {
    const program = new commander.Command();
    const helper = new commander.Help();

    helper.prepareContext({ helpWidth: Infinity });

    const longText = 'enable debug mode with detailed logging output for troubleshooting purposes that goes on and on without any line breaks at all in this description text';
    const wrapped = helper.boxWrap(longText, Infinity);

    // With Infinity width, boxWrap should not wrap
    assert.equal(wrapped, longText);
  });

  test('when helpWidth is explicitly set to a number then wrapping works', () => {
    const program = new commander.Command();
    program.configureOutput({
      getOutHelpWidth: () => 60,
    });
    program.option('-d, --debug', 'enable debug mode with detailed logging output for troubleshooting purposes');

    const helpOutput = program.helpInformation();

    // With explicit width, wrapping should occur
    // The description should be wrapped to fit within the width
    assert.ok(helpOutput.includes('enable debug mode'));
    assert.ok(helpOutput.includes('detailed logging'));
  });
});