import { Command, Help } from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// https://en.wikipedia.org/wiki/ANSI_escape_code
// displayWidth() and the help stripping use node:util stripVTControlCharacters(),
// which removes more than just the SGR sequences handled previously.

const ESC = '\u001b';
const CSI = ESC + '[';
const OSC = ESC + ']';

describe('Help.displayWidth()', () => {
  const help = new Help();

  test('plain text is counted', () => {
    assert.equal(help.displayWidth('abc'), 3);
  });

  test('SGR sequences are ignored', () => {
    assert.equal(help.displayWidth(`${CSI}4mabc${CSI}24m`), 3);
  });

  test('non-SGR CSI sequences are ignored', () => {
    assert.equal(help.displayWidth(`${CSI}2Aabc`), 3);
  });

  test('OSC sequences are ignored', () => {
    const hyperlink = `${OSC}8;;https://example.com\x07abc${OSC}8;;\x07`;
    assert.equal(help.displayWidth(hyperlink), 3);
  });
});

describe('stripping control characters from help output', () => {
  test('helpInformation() strips non-SGR sequences when colours are disabled', () => {
    const program = new Command('program');
    program.configureOutput({ getOutHasColors: () => false });
    program.configureHelp({
      styleCommandText: (str) => `${CSI}2A${str}${CSI}2B`,
    });
    const helpText = program.helpInformation();
    assert.ok(helpText.includes('program'));
    assert.ok(!helpText.includes(ESC));
  });

  test('helpInformation() keeps non-SGR sequences when colours are enabled', () => {
    const program = new Command('program');
    program.configureOutput({ getOutHasColors: () => true });
    program.configureHelp({
      styleCommandText: (str) => `${CSI}2A${str}${CSI}2B`,
    });
    const helpText = program.helpInformation();
    assert.ok(helpText.includes(`${CSI}2Aprogram${CSI}2B`));
  });
});
