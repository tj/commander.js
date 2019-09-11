const commander = require('../');

// NB: regex support is deprecated, and deliberately not documented in README.

describe('option with optional value and regex', () => {
  test('when option regex fails then value is true [sic]', () => {
    const program = new commander.Command();
    program
      .option('-d, --drink [drink]', 'Drink', /^(Water|Wine)$/i);
    program.parse(['node', 'test', '--drink', 'does-not-match']);
    expect(program.drink).toBe(true);
  });

  test('when option regex matches then value is as specified', () => {
    const drinkValue = 'water';
    const program = new commander.Command();
    program
      .option('-d, --drink [drink]', 'Drink', /^(Water|Wine)$/i);
    program.parse(['node', 'test', '--drink', drinkValue]);
    expect(program.drink).toBe(drinkValue);
  });
});

describe('option with required value and regex', () => {
  test('when option regex fails then value is true [sic]', () => {
    const program = new commander.Command();
    program
      .option('-d, --drink <drink>', 'Drink', /^(Water|Wine)$/i);
    program.parse(['node', 'test', '--drink', 'does-not-match']);
    expect(program.drink).toBe(true);
  });

  test('when option regex matches then value is as specified', () => {
    const drinkValue = 'water';
    const program = new commander.Command();
    program
      .option('-d, --drink [drink]', 'Drink', /^(Water|Wine)$/i);
    program.parse(['node', 'test', '--drink', drinkValue]);
    expect(program.drink).toBe(drinkValue);
  });
});
