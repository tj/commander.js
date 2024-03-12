const { Argument } = require('../');

describe('Argument methods that should return this for chaining', () => {
  test('when call .default() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.default(3);
    expect(result).toBe(argument);
  });

  test('when call .argParser() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argParser(() => {});
    expect(result).toBe(argument);
  });

  test('when call .choices() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.choices(['a']);
    expect(result).toBe(argument);
  });

  test('when call .argRequired() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argRequired();
    expect(result).toBe(argument);
  });

  test('when call .argOptional() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argOptional();
    expect(result).toBe(argument);
  });
});
