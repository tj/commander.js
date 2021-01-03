const commander = require('../');

describe('help command listed in helpInformation', () => {
  test('when program has no subcommands then no automatic help command', () => {
    const program = new commander.Command();
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toMatch(/help \[command\]/);
  });

  test('when program has no subcommands and add help command then has help command', () => {
    const program = new commander.Command();
    program.addHelpCommand(true);
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch(/help \[command\]/);
  });

  test('when program has subcommands then has automatic help command', () => {
    const program = new commander.Command();
    program.command('foo');
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch(/help \[command\]/);
  });

  test('when program has subcommands and specify only unknown option then display help', () => {
    const program = new commander.Command();
    program
      .configureHelp({ formatHelp: () => '' })
      .exitOverride()
      .allowUnknownOption()
      .command('foo');
    let caughtErr;
    try {
      program.parse(['--unknown'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toEqual('commander.help');
  });

  test('when program has subcommands and suppress help command then no help command', () => {
    const program = new commander.Command();
    program.addHelpCommand(false);
    program.command('foo');
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toMatch(/help \[command\]/);
  });

  test('when add custom help command then custom help command', () => {
    const program = new commander.Command();
    program.addHelpCommand('myHelp', 'help description');
    const helpInformation = program.helpInformation();
    expect(helpInformation).toMatch(/myHelp +help description/);
  });
});

describe('help command processed on correct command', () => {
  // Use internal knowledge to suppress output to keep test output clean.
  let writeErrorSpy;
  let writeSpy;

  beforeAll(() => {
    writeErrorSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => { });
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  });

  afterEach(() => {
    writeErrorSpy.mockClear();
    writeSpy.mockClear();
  });

  afterAll(() => {
    writeErrorSpy.mockRestore();
    writeSpy.mockRestore();
  });

  test('when "program help" then program', () => {
    const program = new commander.Command();
    program.exitOverride();
    program.command('sub1');
    program.exitOverride(() => { throw new Error('program'); });
    expect(() => {
      program.parse('node test.js help'.split(' '));
    }).toThrow('program');
  });

  test('when "program help unknown" then program', () => {
    const program = new commander.Command();
    program.exitOverride();
    program.command('sub1');
    program.exitOverride(() => { throw new Error('program'); });
    expect(() => {
      program.parse('node test.js help unknown'.split(' '));
    }).toThrow('program');
  });

  test('when "program help sub1" then sub1', () => {
    const program = new commander.Command();
    program.exitOverride();
    const sub1 = program.command('sub1');
    sub1.exitOverride(() => { throw new Error('sub1'); });
    expect(() => {
      program.parse('node test.js help sub1'.split(' '));
    }).toThrow('sub1');
  });

  test('when "program sub1 help sub2" then sub2', () => {
    const program = new commander.Command();
    program.exitOverride();
    const sub1 = program.command('sub1');
    const sub2 = sub1.command('sub2');
    sub2.exitOverride(() => { throw new Error('sub2'); });
    expect(() => {
      program.parse('node test.js sub1 help sub2'.split(' '));
    }).toThrow('sub2');
  });

  test('when default command and "program help" then program', () => {
    const program = new commander.Command();
    program.exitOverride();
    program.command('sub1', { isDefault: true });
    program.exitOverride(() => { throw new Error('program'); });
    expect(() => {
      program.parse('node test.js help'.split(' '));
    }).toThrow('program');
  });
});
