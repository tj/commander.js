const { stripColor } = require('../lib/help');

// https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters

// Test the lowest level routine being used for SGR support.

const ESC = '\u001b';
const CSI = ESC + '[';

test('SGR only', () => {
  const str = `${CSI}4m`;
  expect(stripColor(str)).toEqual('');
});

test('SGR at start', () => {
  const str = `${CSI}4mX`;
  expect(stripColor(str)).toEqual('X');
});

test('SGR in middle', () => {
  const str = `X${CSI}4mY`;
  expect(stripColor(str)).toEqual('XY');
});

test('SGR at end', () => {
  const str = `${CSI}4mY`;
  expect(stripColor(str)).toEqual('Y');
});

test('SGR pair', () => {
  // underline and not underlined
  const str = `${CSI}4mABC${CSI}24m`;
  expect(stripColor(str)).toEqual('ABC');
});

test('explicit reset with zero', () => {
  const str = `${CSI}0m`;
  expect(stripColor(str)).toEqual('');
});

test('implicit reset without zero', () => {
  const str = `${CSI}m`;
  expect(stripColor(str)).toEqual('');
});

test('multiple params: select foreground colour', () => {
  const str = `${CSI}38;5;4m`;
  expect(stripColor(str)).toEqual('');
});

test('multiple params: general', () => {
  const str = `${CSI}2;3;4m`;
  expect(stripColor(str)).toEqual('');
});

test('multiple params: missing param', () => {
  // CSI sequences can omit number (which is then treated as 0)
  const str = `${CSI};;m`;
  expect(stripColor(str)).toEqual('');
});

test('incomplete SGR sequence', () => {
  const str = `${CSI}14X`;
  expect(stripColor(str)).toEqual(`${CSI}14X`);
});
