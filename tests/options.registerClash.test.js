const { Command, Option } = require('../');

describe('.option()', () => {
  test('when short option flag conflicts then throws', () => {
    expect(() => {
      const program = new Command();
      program
        .option('-c, --cheese <type>', 'cheese type')
        .option('-c, --conflict');
    }).toThrow('Cannot add option');
  });

  test('when long option flag conflicts then throws', () => {
    expect(() => {
      const program = new Command();
      program
        .option('-c, --cheese <type>', 'cheese type')
        .option('-H, --cheese');
    }).toThrow('Cannot add option');
  });
});

describe('.addOption()', () => {
  test('when short option flags conflicts then throws', () => {
    expect(() => {
      const program = new Command();
      program
        .option('-c, --cheese <type>', 'cheese type')
        .addOption(new Option('-c, --conflict'));
    }).toThrow('Cannot add option');
  });

  test('when long option flags conflicts then throws', () => {
    expect(() => {
      const program = new Command();
      program
        .option('-c, --cheese <type>', 'cheese type')
        .addOption(new Option('-H, --cheese'));
    }).toThrow('Cannot add option');
  });
});
