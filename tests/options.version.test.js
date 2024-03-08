const commander = require('../');

// Test .version. Using exitOverride to check behaviour (instead of mocking process.exit).

describe('.version', () => {
  test('when no .version and specify --version then unknown option error', () => {
    const errorMessage = 'unknownOption';
    const program = new commander.Command();
    // Override unknownOption as convenient way to check fails as expected.
    jest.spyOn(program, 'unknownOption').mockImplementation(() => {
      throw new Error(errorMessage);
    });

    expect(() => {
      program.parse(['node', 'test', '--version']);
    }).toThrow(errorMessage);
  });

  test('when no .version then helpInformation does not include version', () => {
    const program = new commander.Command();

    const helpInformation = program.helpInformation();

    expect(helpInformation.includes('Usage')).toBe(true);
    expect(helpInformation.includes('version')).toBe(false);
  });

  test('when specify default short flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion);

    expect(() => {
      program.parse(['node', 'test', '-V']);
    }).toThrow(myVersion);
    expect(writeMock).toHaveBeenCalledWith(`${myVersion}\n`);
  });

  test('when specify default long flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion);

    expect(() => {
      program.parse(['node', 'test', '--version']);
    }).toThrow(myVersion);
    expect(writeMock).toHaveBeenCalledWith(`${myVersion}\n`);
  });

  test('when default .version then helpInformation includes default version help', () => {
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program.version(myVersion);

    const helpInformation = program.helpInformation();

    expect(helpInformation.includes('-V, --version')).toBe(true);
    expect(helpInformation.includes('output the version number')).toBe(true);
  });

  test('when specify custom short flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '-r, --revision');

    expect(() => {
      program.parse(['node', 'test', '-r']);
    }).toThrow(myVersion);
    expect(writeMock).toHaveBeenCalledWith(`${myVersion}\n`);
  });

  test('when specify just custom short flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '-r');

    expect(() => {
      program.parse(['node', 'test', '-r']);
    }).toThrow(myVersion);
    expect(writeMock).toHaveBeenCalledWith(`${myVersion}\n`);
  });

  test('when specify custom long flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '-r, --revision');

    expect(() => {
      program.parse(['node', 'test', '--revision']);
    }).toThrow(myVersion);
    expect(writeMock).toHaveBeenCalledWith(`${myVersion}\n`);
  });

  test('when specify just custom long flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '--revision');

    expect(() => {
      program.parse(['node', 'test', '--revision']);
    }).toThrow(myVersion);
    expect(writeMock).toHaveBeenCalledWith(`${myVersion}\n`);
  });

  test('when custom .version then helpInformation includes custom version help', () => {
    const myVersion = '1.2.3';
    const myVersionFlags = '-r, --revision';
    const myVersionDescription = 'custom description';
    const program = new commander.Command();
    program.version(myVersion, myVersionFlags, myVersionDescription);

    const helpInformation = program.helpInformation();

    expect(helpInformation.includes(myVersionFlags)).toBe(true);
    expect(helpInformation.includes(myVersionDescription)).toBe(true);
  });

  test('when have .version+version and specify version then command called', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program.version('1.2.3').command('version').action(actionMock);

    program.parse(['node', 'test', 'version']);

    expect(actionMock).toHaveBeenCalled();
  });

  test('when have .version+version and specify --version then version displayed', () => {
    const myVersion = '1.2.3';
    const writeMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion)
      .command('version')
      .action(() => {});

    expect(() => {
      program.parse(['node', 'test', '--version']);
    }).toThrow(myVersion);
    expect(writeMock).toHaveBeenCalledWith(`${myVersion}\n`);
  });

  test('when specify version then can get version', () => {
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program.version(myVersion);
    expect(program.version()).toEqual(myVersion);
  });
});
