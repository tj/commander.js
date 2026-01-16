import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Help.minWidthToWrap()', () => {
  test('when enough width then wrap', () => {
    const program = new commander.Command('program');
    program.description('x '.repeat(110));
    program.configureOutput({
      getOutHelpWidth: () => 100, // lots of room to wrap
    });
    const helpText = program.helpInformation();
    const wrappedescription =
      'x '.repeat(50).trim() +
      '\n' +
      'x '.repeat(50).trim() +
      '\n' +
      'x '.repeat(10).trim();
    assert.match(helpText, new RegExp(wrappedescription));
  });

  test('when not enough width then no wrap', () => {
    const program = new commander.Command('program');
    program.description('x '.repeat(50));
    program.configureOutput({
      getOutHelpWidth: () => 30, // too narrow to wrap
    });
    const helpText = program.helpInformation();
    const wrappedescription = 'x '.repeat(50);
    assert.match(helpText, new RegExp(wrappedescription));
  });

  test('when make minWidthToWrap small then wrap', () => {
    const program = new commander.Command('program');
    program.description('x '.repeat(40));
    program.configureOutput({
      getOutHelpWidth: () => 30,
    });
    program.configureHelp({ minWidthToWrap: 20 });
    const helpText = program.helpInformation();
    const wrappedescription =
      'x '.repeat(15).trimEnd() +
      '\n' +
      'x '.repeat(15).trimEnd() +
      '\n' +
      'x '.repeat(10).trimEnd();
    assert.match(helpText, new RegExp(wrappedescription));
  });
});
