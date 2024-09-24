const { Help } = require('../');

// https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters

// Test the lowest level routine being used for SGR support.

const ESC = '\u001b';
const CSI = ESC + '[';

test('SGR only', () => {
  const helper = new Help();
  const str = `${CSI}4m`;
  expect(helper.stripAnsi(str)).toEqual('');
});

test('SGR at start', () => {
  const helper = new Help();
  const str = `${CSI}4mX`;
  expect(helper.stripAnsi(str)).toEqual('X');
});

test('SGR in middle', () => {
  const helper = new Help();
  const str = `X${CSI}4mY`;
  expect(helper.stripAnsi(str)).toEqual('XY');
});

test('SGR at end', () => {
  const helper = new Help();
  const str = `${CSI}4mY`;
  expect(helper.stripAnsi(str)).toEqual('Y');
});

test('SGR pair', () => {
  const helper = new Help();
  // underline and not underlined
  const str = `${CSI}4mABC${CSI}24m`;
  expect(helper.stripAnsi(str)).toEqual('ABC');
});

test('explicit reset with zero', () => {
  const helper = new Help();
  const str = `${CSI}0m`;
  expect(helper.stripAnsi(str)).toEqual('');
});

test('implicit reset without zero', () => {
  const helper = new Help();
  const str = `${CSI}m`;
  expect(helper.stripAnsi(str)).toEqual('');
});

test('multiple params: select foreground colour', () => {
  const helper = new Help();
  const str = `${CSI}38;5;4m`;
  expect(helper.stripAnsi(str)).toEqual('');
});

test('multiple params: general', () => {
  const helper = new Help();
  const str = `${CSI}2;3;4m`;
  expect(helper.stripAnsi(str)).toEqual('');
});

test('multiple params: missing param', () => {
  // CSI sequences can omit number (which is then treated as 0)
  const helper = new Help();
  const str = `${CSI};;m`;
  expect(helper.stripAnsi(str)).toEqual('');
});

test('incomplete SGR sequence', () => {
  const helper = new Help();
  const str = `${CSI}14X`;
  expect(helper.stripAnsi(str)).toEqual(`${CSI}14X`);
});
