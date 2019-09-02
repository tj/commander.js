const commander = require('../');

// Test .version

describe('.version', () => {
  // Implement the spy handling outside the test routines to keep the tests focused on arrange/act/assert.
  let exitSpy;
  let writeSpy;
  let fakeExit;

  beforeAll(() => {
    fakeExit = new Error('exit');
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw fakeExit; });
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  });

  afterAll(() => {
    exitSpy.mockRestore();
    writeSpy.mockRestore();
  });

  beforeEach(() => {
    exitSpy.mockClear();
    writeSpy.mockClear();
  });

  test('when no .version and specify --version then unknown option', () => {
    const mockUnknownOption = jest.fn().mockImplementation(() => { throw new Error('unknownOption'); });
    const program = new commander.Command();
    program.unknownOption = mockUnknownOption;

    expect(() => {
      program.parse(['node', 'test', '--version']);
    }).toThrow();

    expect(mockUnknownOption).toHaveBeenCalled();
  });

  test('when no .version then helpInformation does not include version', () => {
    const program = new commander.Command();

    const helpInformation = program.helpInformation();

    expect(helpInformation.includes('Usage')).toBe(true);
    expect(helpInformation.includes('version')).toBe(false);
  });

  test('when specify default short flag then display version', () => {
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program
      .version(myVersion);

    expect(() => {
      program.parse(['node', 'test', '-V']);
    }).toThrow(fakeExit);

    expect(writeSpy).toHaveBeenCalledWith(`${myVersion}\n`);
  });

  test('when specify default long flag then display version', () => {
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program
      .version(myVersion);

    expect(() => {
      program.parse(['node', 'test', '--version']);
    }).toThrow(fakeExit);

    expect(writeSpy).toHaveBeenCalledWith(`${myVersion}\n`);
  });

  test('when default .version then helpInformation includes default version help', () => {
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program
      .version(myVersion);

    const helpInformation = program.helpInformation();

    expect(helpInformation.includes('-V, --version')).toBe(true);
    expect(helpInformation.includes('output the version number')).toBe(true);
  });

  test('when specify custom short flag then display version', () => {
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program
      .version(myVersion, '-r, --revision');

    expect(() => {
      program.parse(['node', 'test', '-r']);
    }).toThrow(fakeExit);

    expect(writeSpy).toHaveBeenCalledWith(`${myVersion}\n`);
  });

  test('when specify custom long flag then display version', () => {
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program
      .version(myVersion, '-r, --revision');

    expect(() => {
      program.parse(['node', 'test', '--revision']);
    }).toThrow(fakeExit);

    expect(writeSpy).toHaveBeenCalledWith(`${myVersion}\n`);
  });

  test('when custom .version then helpInformation includes custom version help', () => {
    const myVersion = '1.2.3';
    const myVersionFlags = '-r, --revision';
    const myVersionDescription = 'custom description';
    const program = new commander.Command();
    program
      .version(myVersion, myVersionFlags, myVersionDescription);

    const helpInformation = program.helpInformation();

    expect(helpInformation.includes(myVersionFlags)).toBe(true);
    expect(helpInformation.includes(myVersionDescription)).toBe(true);
  });

  test('when have .version+version and specify version then command called', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program
      .version('1.2.3')
      .command('version')
      .action(actionMock);

    program.parse(['node', 'test', 'version']);

    expect(actionMock).toHaveBeenCalled();
  });

  test('when have .version+version and specify --version then version displayed', () => {
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program
      .version(myVersion)
      .command('version')
      .action(jest.fn());

    expect(() => {
      program.parse(['node', 'test', '--version']);
    }).toThrow(fakeExit);

    expect(writeSpy).toHaveBeenCalledWith(`${myVersion}\n`);
  });
});
