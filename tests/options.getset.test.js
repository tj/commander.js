const commander = require('../');

describe.each([true, false])('storeOptionsAsProperties is %s', (storeOptionsAsProperties) => {
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
});
