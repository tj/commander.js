const { useColor } = require('../lib/command.js');

describe('internal useColor environment variable support', () => {
  let holdNoColor = process.env.NO_COLOR;
  let holdForceColor = process.env.FORCE_COLOR;
  let holdCliColorForce = process.env.CLICOLOR_FORCE;

  beforeEach(() => {
    delete process.env.NO_COLOR;
    delete process.env.FORCE_COLOR;
    delete process.env.CLICOLOR_FORCE;
  });

  afterAll(() => {
    if (holdNoColor === undefined) delete process.env.NO_COLOR;
    else process.env.NO_COLOR = holdNoColor;

    if (holdForceColor === undefined) delete process.env.FORCE_COLOR;
    else process.env.FORCE_COLOR = holdForceColor;

    if (holdCliColorForce === undefined) delete process.env.CLICOLOR_FORCE;
    else process.env.CLICOLOR_FORCE = holdCliColorForce;
  });

  test('when no ENV defined then returns undefined', () => {
    expect(useColor()).toBeUndefined();
  });

  // https://no-color.org
  //
  //    Command-line software which adds ANSI color to its output by default should check for a NO_COLOR environment variable that,
  //    when present and not an empty string (regardless of its value), prevents the addition of ANSI color.

  test('when NO_COLOR defined then returns false', () => {
    process.env.NO_COLOR = 'non-empty';
    expect(useColor()).toBe(false);
  });

  test('when NO_COLOR empty then returns undefined', () => {
    process.env.NO_COLOR = '';
    expect(useColor()).toBe(undefined);
  });

  // https://bixense.com/clicolors/

  test('when CLICOLOR_FORCE defined then returns true', () => {
    process.env.CLICOLOR_FORCE = '1';
    expect(useColor()).toBe(true);
  });

  test('when CLICOLOR_FORCE empty then returns true', () => {
    // Follow original Apple usage and test for existence, don't ignore empty value.
    process.env.CLICOLOR_FORCE = '';
    expect(useColor()).toBe(true);
  });

  test('when CLICOLOR_FORCE and NO_COLOR defined then returns false', () => {
    // NO_COLOR trumps CLICOLOR_FORCE
    process.env.NO_COLOR = '1';
    process.env.CLICOLOR_FORCE = '1';
    expect(useColor()).toBe(false);
  });

  // chalk: https://github.com/chalk/supports-color/blob/c214314a14bcb174b12b3014b2b0a8de375029ae/index.js#L33
  // node: https://github.com/nodejs/node/blob/0a00217a5f67ef4a22384cfc80eb6dd9a917fdc1/lib/internal/tty.js#L109
  // (https://force-color.org recent web page from 2023, does not match major javascript implementations)
  //
  // Chalk ignores anything except for 0,1,2,3,4,true,false values.
  // Node somewhat follows Chalk with 0,1,2,3,true, but treats empty as true and unexpected values as false.
  // Test the expected Chalk values (which do produce same result in node).

  test.each([
    ['true', true],
    ['false', false],
    ['0', false],
    ['1', true],
    ['2', true],
    ['3', true],
  ])('when FORCE_COLOR=%s then returns %s', (value, result) => {
    process.env.FORCE_COLOR = value;
    expect(useColor()).toBe(result);
  });
});
