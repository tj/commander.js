const { Help } = require('../');

// https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters

const ESC = '\u001b';
const CSI = ESC + '[';

function makeExperimentalHelper() {
  const helper = new Help();
  helper.experimentalColorSupport = true; // Currently opt-in
  return helper;
}

test('SGR pair', () => {
  const helper = makeExperimentalHelper();
  // underline and not underlined
  const str = `${CSI}4mABC${CSI}24m`;
  expect(helper.displayWidth(str)).toEqual(3);
});

test('explicit reset with zero', () => {
  const helper = makeExperimentalHelper();
  const str = `${CSI}0mX`;
  expect(helper.displayWidth(str)).toEqual(1);
});

test('implicit reset without zero', () => {
  const helper = makeExperimentalHelper();
  const str = `X${CSI}m`;
  expect(helper.displayWidth(str)).toEqual(1);
});

test('multiple params: select foreground colour', () => {
  const helper = makeExperimentalHelper();
  const str = `${CSI}38;5;4m`;
  expect(helper.displayWidth(str)).toEqual(0);
});

test('multiple params: general', () => {
  const helper = makeExperimentalHelper();
  const str = `${CSI}2;3;4m`;
  expect(helper.displayWidth(str)).toEqual(0);
});

test('multiple params: missing param', () => {
  // CSI sequences can omit number (which is then treated as 0)
  const helper = makeExperimentalHelper();
  const str = `${CSI};;m`;
  expect(helper.displayWidth(str)).toEqual(0);
});

test('incomplete SGR sequence', () => {
  const helper = makeExperimentalHelper();
  const str = `${CSI}14X`;
  expect(helper.displayWidth(str)).toEqual(str.length);
});

test('str length when experimentalColorSupport false', () => {
  const helper = new Help();
  const str = `${CSI}4mABC${CSI}24m`;
  expect(helper.displayWidth(str)).toEqual(str.length);
});
