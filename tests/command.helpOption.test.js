const commander = require('../');

describe('helpOption', () => {
  let writeSpy;
  let consoleErrorSpy;

  beforeAll(() => {
    // Optional. Suppress expected output to keep test output clean.
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    writeSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    writeSpy.mockRestore();
    consoleErrorSpy.mockRestore();
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

  test('when helpOption(false) then helpInformation does not include --help', () => {
    const program = new commander.Command();
    program
      .helpOption(false);
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toMatch('--help');
  });

  test('when helpOption(false) then --help is an unknown option', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .helpOption(false);
    let caughtErr;
    try {
      program.parse(['--help'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
  });

  test('when helpOption(false) then -h is an unknown option', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .helpOption(false);
    let caughtErr;
    try {
      program.parse(['-h'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
  });

  test('when helpOption(false) then unknown command error does not suggest --help', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .helpOption(false)
      .command('foo');
    expect(() => {
      program.parse(['UNKNOWN'], { from: 'user' });
    }).toThrow("error: unknown command 'UNKNOWN'.");
  });
});
