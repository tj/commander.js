import { Command, Help } from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// `Help.displayWidth()` and the default help stripping now use
// `stripVTControlCharacters()` from `node:util`, which removes control
// sequences beyond the SGR colour codes the previous custom implementation
// handled.

const ESC = '\u001b';
const CSI = ESC + '[';
const OSC = ESC + ']';

describe('Help.displayWidth() control sequences', () => {
  const help = new Help();

  test('plain text', () => {
    assert.equal(help.displayWidth('abc'), 3);
  });

  test('SGR sequences are ignored', () => {
    assert.equal(help.displayWidth(`${CSI}4mabc${CSI}24m`), 3);
  });

  test('non-SGR CSI sequences are ignored', () => {
    assert.equal(help.displayWidth(`${CSI}2Aabc`), 3);
  });

  test('OSC sequences are ignored', () => {
    assert.equal(
      help.displayWidth(`${OSC}8;;https://example.com\x07abc${OSC}8;;\x07`),
      3,
    );
  });
});

describe('help output strips control characters when colours are disabled', () => {
  function makeProgram(hasColors) {
    const program = new Command('program');
    program.configureOutput({ getOutHasColors: () => hasColors });
    program.configureHelp({
      styleCommandText: (str) => `${CSI}2A${str}${CSI}2B`,
    });
    return program;
  }

  test('non-SGR sequences are stripped', () => {
    const helpText = makeProgram(false).helpInformation();
    assert.ok(helpText.includes('program'));
    assert.ok(!helpText.includes(ESC));
  });

  test('non-SGR sequences are kept when colours are enabled', () => {
    const helpText = makeProgram(true).helpInformation();
    assert.ok(helpText.includes(`${CSI}2Aprogram${CSI}2B`));
  });
});
