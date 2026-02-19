import { stripColor } from '../lib/help.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters

// Test the lowest level routine being used for SGR support.

const ESC = '\u001b';
const CSI = ESC + '[';

describe('internal stripColor()', () => {
  test('SGR only', () => {
    const str = `${CSI}4m`;
    assert.equal(stripColor(str), '');
  });

  test('SGR at start', () => {
    const str = `${CSI}4mX`;
    assert.equal(stripColor(str), 'X');
  });

  test('SGR in middle', () => {
    const str = `X${CSI}4mY`;
    assert.equal(stripColor(str), 'XY');
  });

  test('SGR at end', () => {
    const str = `${CSI}4mY`;
    assert.equal(stripColor(str), 'Y');
  });

  test('SGR pair', () => {
    // underline and not underlined
    const str = `${CSI}4mABC${CSI}24m`;
    assert.equal(stripColor(str), 'ABC');
  });

  test('explicit reset with zero', () => {
    const str = `${CSI}0m`;
    assert.equal(stripColor(str), '');
  });

  test('implicit reset without zero', () => {
    const str = `${CSI}m`;
    assert.equal(stripColor(str), '');
  });

  test('multiple params: select foreground colour', () => {
    const str = `${CSI}38;5;4m`;
    assert.equal(stripColor(str), '');
  });

  test('multiple params: general', () => {
    const str = `${CSI}2;3;4m`;
    assert.equal(stripColor(str), '');
  });

  test('multiple params: missing param', () => {
    // CSI sequences can omit number (which is then treated as 0)
    const str = `${CSI};;m`;
    assert.equal(stripColor(str), '');
  });

  test('incomplete SGR sequence', () => {
    const str = `${CSI}14X`;
    assert.equal(stripColor(str), `${CSI}14X`);
  });
});
