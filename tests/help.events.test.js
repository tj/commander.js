const commander = require('../');

// Using .outputHelp more than .help, since don't need to avoid process.exit if tests go wrong.
// Assuming .help calls .outputHelp so not testing separately.

describe('listeners for "help" and "groupHelp"', () => {
  let writeSpy;

  beforeAll(() => {
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  });

  afterEach(() => {
    writeSpy.mockClear();
  });

  afterAll(() => {
    writeSpy.mockRestore();
  });

  test('when no listener then default help implementation', () => {
    const program = new commander.Command();
    program.outputHelp();
    expect(writeSpy).toHaveBeenCalledWith(program.helpInformation());
    writeSpy.mockClear();
  });

  test('when on("help") then just "help"', () => {
    const program = new commander.Command();
    const customHelp = jest.fn();
    program
      .on('help', customHelp);
    program.outputHelp();
    expect(writeSpy).toHaveBeenCalledTimes(0);
    expect(customHelp).toHaveBeenCalledTimes(1);
    writeSpy.mockClear();
  });

  test('when on("groupHelp") then just "groupHelp"', () => {
    const program = new commander.Command();
    const customHelp = jest.fn();
    program
      .on('groupHelp', customHelp);
    program.outputHelp();
    expect(writeSpy).toHaveBeenCalledTimes(0);
    expect(customHelp).toHaveBeenCalledTimes(1);
    writeSpy.mockClear();
  });

  test('when on("groupHelp") and subcommand help then just "groupHelp"', () => {
    const program = new commander.Command();
    const customHelp = jest.fn();
    program
      .exitOverride()
      .on('groupHelp', customHelp)
      .command('sub');
    expect(() => {
      program.parse(['sub', '--help'], { from: 'user' });
    }).toThrow('(outputHelp)');
    expect(writeSpy).toHaveBeenCalledTimes(0);
    expect(customHelp).toHaveBeenCalledTimes(1);
    writeSpy.mockClear();
  });

  test('when on("help") and on("groupHelp") then just "help"', () => {
    const program = new commander.Command();
    const customHelp = jest.fn();
    const customGroupHelp = jest.fn();
    program
      .on('help', customHelp)
      .on('groupHelp', customGroupHelp);
    program.outputHelp();
    expect(writeSpy).toHaveBeenCalledTimes(0);
    expect(customGroupHelp).toHaveBeenCalledTimes(0);
    expect(customHelp).toHaveBeenCalledTimes(1);
    writeSpy.mockClear();
  });
});
