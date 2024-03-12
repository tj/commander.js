const commander = require('../');

describe.each([true, false])(
  'storeOptionsAsProperties is %s',
  (storeOptionsAsProperties) => {
    test('when option specified on CLI then value returned by getOptionValue', () => {
      const program = new commander.Command();
      program
        .storeOptionsAsProperties(storeOptionsAsProperties)
        .option('--cheese [type]', 'cheese type');
      const cheeseType = 'blue';
      program.parse(['node', 'test', '--cheese', cheeseType]);
      expect(program.getOptionValue('cheese')).toBe(cheeseType);
    });

    test('when setOptionValue then value returned by opts', () => {
      const program = new commander.Command();
      const cheeseType = 'blue';
      // Note: opts() only returns declared options when options stored as properties
      program
        .storeOptionsAsProperties(storeOptionsAsProperties)
        .option('--cheese [type]', 'cheese type')
        .setOptionValue('cheese', cheeseType);
      expect(program.opts().cheese).toBe(cheeseType);
    });
  },
);

test('when setOptionValueWithSource then value returned by opts', () => {
  const program = new commander.Command();
  const cheeseValue = 'blue';
  program
    .option('--cheese [type]', 'cheese type')
    .setOptionValueWithSource('cheese', cheeseValue, 'cli');
  expect(program.opts().cheese).toBe(cheeseValue);
});

test('when setOptionValueWithSource then source returned by getOptionValueSource', () => {
  const program = new commander.Command();
  program
    .option('--cheese [type]', 'cheese type')
    .setOptionValueWithSource('cheese', 'blue', 'config');
  expect(program.getOptionValueSource('cheese')).toBe('config');
});

test('when option value parsed from env then option source is env', () => {
  const program = new commander.Command();
  process.env.BAR = 'env';
  program.addOption(new commander.Option('-f, --foo').env('BAR'));
  program.parse([], { from: 'user' });
  expect(program.getOptionValueSource('foo')).toBe('env');
  delete process.env.BAR;
});

test('when option value parsed from cli then option source is cli', () => {
  const program = new commander.Command();
  program.addOption(new commander.Option('-f, --foo').env('BAR'));
  program.parse(['--foo'], { from: 'user' });
  expect(program.getOptionValueSource('foo')).toBe('cli');
});

test('when setOptionValue then clears previous source', () => {
  const program = new commander.Command();
  program.option('--foo', 'description', 'default value');
  expect(program.getOptionValueSource('foo')).toBe('default');
  program.setOptionValue('foo', 'bar');
  expect(program.getOptionValueSource('foo')).toBeUndefined();
});
