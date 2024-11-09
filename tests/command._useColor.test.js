const { useColor } = require('../lib/command.js');

// useColor is an internal method, and hard to test indirectly because it is
// combined with standard stream methods like:
//    useColor() ?? (process.stdout.isTTY && process.stdout.hasColors?.())
//
// Testing environment variables is a bit fragile because Jest uses some of them too!

describe('useColor', () => {
  let holdNoColor = process.env.NO_COLOR;
  let holdForceColor = process.env.FORCE_COLOR;
  let holdCliColorForce = process.env.CLICOLOR_FORCE;

  beforeEach(() => {
    delete process.env.NO_COLOR;
    delete process.env.FORCE_COLOR;
    delete process.env.CLICOLOR_FORCE;
  });

  afterAll(() => {
    process.env.NO_COLOR = holdNoColor;
    process.env.FORCE_COLOR = holdForceColor;
    process.env.CLICOLOR_FORCE = holdCliColorForce;
  });

  test('when no ENV defined then returns undefined', () => {
    expect(useColor()).toBeUndefined();
  });

  // https://no-color.org
  // Command-line software which adds ANSI color to its output by default should check for a NO_COLOR environment variable that,
  // when present and not an empty string (regardless of its value), prevents the addition of ANSI color.

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

  test('when CLICOLOR_FORCE and NO_COLOR defined then returns false', () => {
    // NO_COLOR trumps CLICOLOR_FORCE
    process.env.NO_COLOR = '1';
    process.env.CLICOLOR_FORCE = '1';
    expect(useColor()).toBe(false);
  });

  // https://force-color.org
  // Command-line software which outputs colored text should check for a FORCE_COLOR environment variable.
  // When this variable is present and not an empty string (regardless of its value), it should force the addition of ANSI color.

  test('when FORCE_COLOR defined then returns true', () => {
    process.env.FORCE_COLOR = 'non-empty';
    expect(useColor()).toBe(true);
  });

  test('when FORCE_COLOR empty then returns undefined', () => {
    process.env.FORCE_COLOR = '';
    expect(useColor()).toBe(undefined);
  });

  // Chalk and node
  test('when FORCE_COLOR=0 then returns false', () => {
    process.env.FORCE_COLOR = '0';
    expect(useColor()).toBe(false);
  });
});
