const commander = require('../');

describe('helpOption', () => {
  let writeSpy;

  beforeAll(() => {
    // Optional. Suppress normal output to keep test output clean.
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  });

  afterEach(() => {
    writeSpy.mockClear();
  });

  afterAll(() => {
    writeSpy.mockRestore();
  });

  test('when helpOption has custom flags then custom short flag invokes help', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .helpOption('-c,--custom-help', 'custom help output');
    expect(() => {
      program.parse(['-c'], { from: 'user' });
    }).toThrow('(outputHelp)');
  });

  test('when helpOption has custom flags then custom long flag invokes help', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .helpOption('-c,--custom-help', 'custom help output');
    expect(() => {
      program.parse(['--custom-help'], { from: 'user' });
    }).toThrow('(outputHelp)');
  });

  test('when helpOption has just custom short flag then custom short flag invokes help', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .helpOption('-c', 'custom help output');
    expect(() => {
      program.parse(['-c'], { from: 'user' });
    }).toThrow('(outputHelp)');
  });

  test('when helpOption has just custom long flag then custom long flag invokes help', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .helpOption('--custom-help', 'custom help output');
    expect(() => {
      program.parse(['--custom-help'], { from: 'user' });
    }).toThrow('(outputHelp)');
  });

  test('when helpOption has custom description then helpInformation include custom description', () => {
    const program = new commander.Command();
    program
      .helpOption('-C,--custom-help', 'custom help output');
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch(/-C,--custom-help +custom help output/);
  });
});
