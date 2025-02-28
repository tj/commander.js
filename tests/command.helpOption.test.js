const commander = require('../');

describe('helpOption', () => {
  let writeSpy;
  let writeErrorSpy;

  beforeAll(() => {
    // Optional. Suppress expected output to keep test output clean.
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
    writeErrorSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    writeSpy.mockClear();
    writeErrorSpy.mockClear();
  });

  afterAll(() => {
    writeSpy.mockRestore();
    writeErrorSpy.mockRestore();
  });

  test('when helpOption has custom flags then custom short flag invokes help', () => {
    const program = new commander.Command();
    program.exitOverride().helpOption('-c,--custom-help', 'custom help output');
    expect(() => {
      program.parse(['-c'], { from: 'user' });
    }).toThrow('(outputHelp)');
  });

  test('when helpOption has custom flags then custom long flag invokes help', () => {
    const program = new commander.Command();
    program.exitOverride().helpOption('-c,--custom-help', 'custom help output');
    expect(() => {
      program.parse(['--custom-help'], { from: 'user' });
    }).toThrow('(outputHelp)');
  });

  test('when helpOption has just custom short flag then custom short flag invokes help', () => {
    const program = new commander.Command();
    program.exitOverride().helpOption('-c', 'custom help output');
    expect(() => {
      program.parse(['-c'], { from: 'user' });
    }).toThrow('(outputHelp)');
  });

  test('when helpOption has just custom long flag then custom long flag invokes help', () => {
    const program = new commander.Command();
    program.exitOverride().helpOption('--custom-help', 'custom help output');
    expect(() => {
      program.parse(['--custom-help'], { from: 'user' });
    }).toThrow('(outputHelp)');
  });

  test('when helpOption has custom description then helpInformation include custom description', () => {
    const program = new commander.Command();
    program.helpOption('-C,--custom-help', 'custom help output');
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch(/-C,--custom-help +custom help output/);
  });

  test('when helpOption has just flags then helpInformation includes default description', () => {
    const program = new commander.Command();
    program.helpOption('-C,--custom-help');
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch(
      /-C,--custom-help +display help for command/,
    );
  });

  test('when helpOption has just description then helpInformation includes default flags', () => {
    const program = new commander.Command();
    program.helpOption(undefined, 'custom help output');
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch(/-h, --help +custom help output/);
  });

  test('when helpOption(false) then helpInformation does not include --help', () => {
    const program = new commander.Command();
    program.helpOption(false);
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toMatch('--help');
  });

  test('when helpOption(false) then --help is an unknown option', () => {
    const program = new commander.Command();
    program.exitOverride().helpOption(false);
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
    program.exitOverride().helpOption(false);
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
    program.exitOverride().helpOption(false).command('foo');
    expect(() => {
      program.parse(['UNKNOWN'], { from: 'user' });
    }).toThrow("error: unknown command 'UNKNOWN'");
  });

  test('when helpOption(true) after false then helpInformation does include --help', () => {
    const program = new commander.Command();
    program.helpOption(false);
    program.helpOption(true);
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch('--help');
  });

  test('when helpOption(true) after customise then helpInformation still customised', () => {
    const program = new commander.Command();
    program.helpOption('--ASSIST');
    program.helpOption(true);
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch('--ASSIST');
  });
});
