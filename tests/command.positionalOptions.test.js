const commander = require('../');

// The changes to parsing for positional options are subtle, and took extra care to work with
// implicit help and default commands. Lots of tests.

describe('program with passThrough', () => {
  function makeProgram() {
    const program = new commander.Command();
    program.passThroughOptions();
    program.option('-d, --debug').argument('<args...>');
    return program;
  }

  test('when option before command-argument then option parsed', () => {
    const program = makeProgram();
    program.parse(['--debug', 'arg'], { from: 'user' });
    expect(program.args).toEqual(['arg']);
    expect(program.opts().debug).toBe(true);
  });

  test('when known option after command-argument then option passed through', () => {
    const program = makeProgram();
    program.parse(['arg', '--debug'], { from: 'user' });
    expect(program.args).toEqual(['arg', '--debug']);
    expect(program.opts().debug).toBeUndefined();
  });

  test('when unknown option after command-argument then option passed through', () => {
    const program = makeProgram();
    program.parse(['arg', '--pass'], { from: 'user' });
    expect(program.args).toEqual(['arg', '--pass']);
  });

  test('when action handler and unknown option after command-argument then option passed through', () => {
    const program = makeProgram();
    const mockAction = jest.fn();
    program.action(mockAction);
    program.parse(['arg', '--pass'], { from: 'user' });
    expect(mockAction).toHaveBeenCalledWith(
      ['arg', '--pass'],
      program.opts(),
      program,
    );
  });

  test('when help option (without command-argument) then help called', () => {
    const program = makeProgram();
    const mockHelp = jest.fn(() => '');

    program.exitOverride().configureHelp({ formatHelp: mockHelp });
    try {
      program.parse(['--help'], { from: 'user' });
    } catch (err) {
      /* empty */
    }
    expect(mockHelp).toHaveBeenCalled();
  });

  test('when help option after command-argument then option passed through', () => {
    const program = makeProgram();
    program.parse(['arg', '--help'], { from: 'user' });
    expect(program.args).toEqual(['arg', '--help']);
  });

  test('when version option after command-argument then option passed through', () => {
    const program = makeProgram();
    program.version('1.2.3');
    program.parse(['arg', '--version'], { from: 'user' });
    expect(program.args).toEqual(['arg', '--version']);
  });
});

// -----------------------------------------------------------

describe('program with positionalOptions and subcommand', () => {
  function makeProgram() {
    const program = new commander.Command();
    program
      .enablePositionalOptions()
      .option('-s, --shared <value>')
      .argument('<args...>');
    const sub = program
      .command('sub')
      .argument('[arg]')
      .option('-s, --shared <value>')
      .action(() => {}); // Not used, but normal to have action handler on subcommand.
    return { program, sub };
  }

  test('when global option before subcommand then global option parsed', () => {
    const { program } = makeProgram();
    program.parse(['--shared', 'program', 'sub'], { from: 'user' });
    expect(program.opts().shared).toEqual('program');
  });

  test('when shared option after subcommand then parsed by subcommand', () => {
    const { program, sub } = makeProgram();
    program.parse(['sub', '--shared', 'local'], { from: 'user' });
    expect(sub.opts().shared).toEqual('local');
    expect(program.opts().shared).toBeUndefined();
  });

  test('when shared option after subcommand argument then parsed by subcommand', () => {
    const { program, sub } = makeProgram();
    program.parse(['sub', 'arg', '--shared', 'local'], { from: 'user' });
    expect(sub.opts().shared).toEqual('local');
    expect(sub.args).toEqual(['arg']);
    expect(program.opts().shared).toBeUndefined();
  });

  test('when shared option before and after subcommand then both parsed', () => {
    const { program, sub } = makeProgram();
    program.parse(['--shared', 'program', 'sub', '--shared', 'local'], {
      from: 'user',
    });
    expect(program.opts().shared).toEqual('program');
    expect(sub.opts().shared).toEqual('local');
  });

  test.each([
    [[], 1, 0],
    [['sub'], 0, 0],
    [['--help'], 1, 0],
    [['sub', '--help'], 0, 1],
    [['sub', 'foo', '--help'], 0, 1],
    [['help'], 1, 0],
    [['help', 'sub'], 0, 1],
  ])(
    'help: when user args %p then program/sub help called %p/%p',
    (userArgs, expectProgramHelpCount, expectSubHelpCount) => {
      const { program, sub } = makeProgram();
      const mockProgramHelp = jest.fn();
      program.exitOverride().configureHelp({ formatHelp: mockProgramHelp });
      const mockSubHelp = jest.fn();
      sub.exitOverride().configureHelp({ formatHelp: mockSubHelp });

      try {
        program.parse(userArgs, { from: 'user' });
      } catch (err) {
        /* empty */
      }
      expect(mockProgramHelp).toHaveBeenCalledTimes(expectProgramHelpCount);
      expect(mockSubHelp).toHaveBeenCalledTimes(expectSubHelpCount);
    },
  );
});

// ---------------------------------------------------------------

describe('program with positionalOptions and default subcommand (called sub)', () => {
  function makeProgram() {
    const program = new commander.Command();
    program
      .enablePositionalOptions()
      .option('-s, --shared')
      .option('-g, --global')
      .argument('<args...>');
    const sub = program
      .command('sub', { isDefault: true })
      .argument('[args...]')
      .option('-s, --shared')
      .option('-d, --default')
      .action(() => {}); // Not used, but normal to have action handler on subcommand.
    program.command('another'); // Not used, but normal to have more than one subcommand if have a default.
    return { program, sub };
  }

  test('when program option before sub option then program option read by program', () => {
    const { program } = makeProgram();
    program.parse(['--global', '--default'], { from: 'user' });
    expect(program.opts().global).toBe(true);
  });

  test('when program option before sub option then sub option read by sub', () => {
    const { program, sub } = makeProgram();
    program.parse(['--global', '--default'], { from: 'user' });
    expect(sub.opts().default).toBe(true);
  });

  test('when shared option before sub argument then option read by program', () => {
    const { program } = makeProgram();
    program.parse(['--shared', 'foo'], { from: 'user' });
    expect(program.opts().shared).toBe(true);
  });

  test('when shared option after sub argument then option read by sub', () => {
    const { program, sub } = makeProgram();
    program.parse(['foo', '--shared'], { from: 'user' });
    expect(sub.opts().shared).toBe(true);
  });

  test.each([
    [[], 0, 0],
    [['--help'], 1, 0],
    [['help'], 1, 0],
  ])(
    'help: when user args %p then program/sub help called %p/%p',
    (userArgs, expectProgramHelpCount, expectSubHelpCount) => {
      const { program, sub } = makeProgram();
      const mockProgramHelp = jest.fn();
      program.exitOverride().configureHelp({ formatHelp: mockProgramHelp });
      const mockSubHelp = jest.fn();
      sub.exitOverride().configureHelp({ formatHelp: mockSubHelp });

      try {
        program.parse(userArgs, { from: 'user' });
      } catch (err) {
        /* empty */
      }
      expect(mockProgramHelp).toHaveBeenCalledTimes(expectProgramHelpCount);
      expect(mockSubHelp).toHaveBeenCalledTimes(expectSubHelpCount);
    },
  );
});

// ------------------------------------------------------------------------------

describe('subcommand with passThrough', () => {
  function makeProgram() {
    const program = new commander.Command();
    program
      .enablePositionalOptions()
      .option('-s, --shared <value>')
      .argument('<args...>');
    const sub = program
      .command('sub')
      .passThroughOptions()
      .argument('[args...]')
      .option('-s, --shared <value>')
      .option('-d, --debug')
      .action(() => {}); // Not used, but normal to have action handler on subcommand.
    return { program, sub };
  }

  test('when option before command-argument then option parsed', () => {
    const { program, sub } = makeProgram();
    program.parse(['sub', '--debug', 'arg'], { from: 'user' });
    expect(sub.args).toEqual(['arg']);
    expect(sub.opts().debug).toBe(true);
  });

  test('when known option after command-argument then option passed through', () => {
    const { program, sub } = makeProgram();
    program.parse(['sub', 'arg', '--debug'], { from: 'user' });
    expect(sub.args).toEqual(['arg', '--debug']);
    expect(sub.opts().debug).toBeUndefined();
  });

  test('when unknown option after command-argument then option passed through', () => {
    const { program, sub } = makeProgram();
    program.parse(['sub', 'arg', '--pass'], { from: 'user' });
    expect(sub.args).toEqual(['arg', '--pass']);
  });

  test('when action handler and unknown option after command-argument then option passed through', () => {
    const { program, sub } = makeProgram();
    const mockAction = jest.fn();
    sub.action(mockAction);
    program.parse(['sub', 'arg', '--pass'], { from: 'user' });
    expect(mockAction).toHaveBeenCalledWith(['arg', '--pass'], sub.opts(), sub);
  });

  test('when help option after command-argument then option passed through', () => {
    const { program, sub } = makeProgram();
    program.parse(['sub', 'arg', '--help'], { from: 'user' });
    expect(sub.args).toEqual(['arg', '--help']);
  });

  test('when version option after command-argument then option passed through', () => {
    const { program, sub } = makeProgram();
    program.version('1.2.3');
    program.parse(['sub', 'arg', '--version'], { from: 'user' });
    expect(sub.args).toEqual(['arg', '--version']);
  });

  test('when shared option before sub and after sub and after sub parameter then all three parsed', () => {
    const { program, sub } = makeProgram();
    program.parse(
      ['--shared=global', 'sub', '--shared=local', 'arg', '--shared'],
      { from: 'user' },
    );
    expect(program.opts().shared).toEqual('global');
    expect(sub.opts().shared).toEqual('local');
    expect(sub.args).toEqual(['arg', '--shared']);
  });
});

// ------------------------------------------------------------------------------

describe('default command with passThrough', () => {
  function makeProgram() {
    const program = new commander.Command();
    program.enablePositionalOptions();
    const sub = program
      .command('sub', { isDefault: true })
      .passThroughOptions()
      .argument('[args...]')
      .option('-d, --debug')
      .action(() => {}); // Not used, but normal to have action handler on subcommand.
    return { program, sub };
  }

  test('when option before command-argument then option parsed', () => {
    const { program, sub } = makeProgram();
    program.parse(['--debug', 'arg'], { from: 'user' });
    expect(sub.args).toEqual(['arg']);
    expect(sub.opts().debug).toBe(true);
  });

  test('when known option after command-argument then option passed through', () => {
    const { program, sub } = makeProgram();
    program.parse(['arg', '--debug'], { from: 'user' });
    expect(sub.args).toEqual(['arg', '--debug']);
    expect(sub.opts().debug).toBeUndefined();
  });

  test('when unknown option after command-argument then option passed through', () => {
    const { program, sub } = makeProgram();
    program.parse(['arg', '--pass'], { from: 'user' });
    expect(sub.args).toEqual(['arg', '--pass']);
  });

  test('when action handler and unknown option after command-argument then option passed through', () => {
    const { program, sub } = makeProgram();
    const mockAction = jest.fn();
    sub.action(mockAction);
    program.parse(['arg', '--pass'], { from: 'user' });
    expect(mockAction).toHaveBeenCalledWith(['arg', '--pass'], sub.opts(), sub);
  });
});

// ------------------------------------------------------------------------------

describe('program with action handler and positionalOptions and subcommand', () => {
  function makeProgram() {
    const program = new commander.Command();
    program
      .enablePositionalOptions()
      .option('-g, --global')
      .argument('<args...>')
      .action(() => {});
    const sub = program
      .command('sub')
      .argument('[arg]')
      .action(() => {});
    return { program, sub };
  }

  test('when global option before parameter then global option parsed', () => {
    const { program } = makeProgram();
    program.parse(['--global', 'foo'], { from: 'user' });
    expect(program.opts().global).toBe(true);
  });

  test('when global option after parameter then global option parsed', () => {
    const { program } = makeProgram();
    program.parse(['foo', '--global'], { from: 'user' });
    expect(program.opts().global).toBe(true);
  });

  test('when global option after parameter with same name as subcommand then global option parsed', () => {
    const { program } = makeProgram();
    program.parse(['foo', 'sub', '--global'], { from: 'user' });
    expect(program.opts().global).toBe(true);
  });
});

// ------------------------------------------------------------------------------

describe('broken passThrough', () => {
  test('when program not positional and turn on passThroughOptions in subcommand then error', () => {
    const program = new commander.Command();
    const sub = program.command('sub');

    expect(() => {
      sub.passThroughOptions();
    }).toThrow();
  });

  test('when program not positional and add subcommand with passThroughOptions then error', () => {
    const program = new commander.Command();
    const sub = new commander.Command('sub').passThroughOptions();

    expect(() => {
      program.addCommand(sub);
    }).toThrow();
  });
});

// ------------------------------------------------------------------------------

describe('program with action handler and passThrough and subcommand', () => {
  function makeProgram() {
    const program = new commander.Command();
    program
      .passThroughOptions()
      .option('-g, --global')
      .argument('<args...>')
      .action(() => {});
    const sub = program
      .command('sub')
      .argument('[arg]')
      .option('-g, --group')
      .option('-d, --debug')
      .action(() => {});
    return { program, sub };
  }

  test('when global option before parameter then global option parsed', () => {
    const { program } = makeProgram();
    program.parse(['--global', 'foo'], { from: 'user' });
    expect(program.opts().global).toBe(true);
  });

  test('when global option after parameter then passed through', () => {
    const { program } = makeProgram();
    program.parse(['foo', '--global'], { from: 'user' });
    expect(program.args).toEqual(['foo', '--global']);
  });

  test('when subcommand option after subcommand then option parsed', () => {
    const { program, sub } = makeProgram();
    program.parse(['sub', '--debug'], { from: 'user' });
    expect(sub.opts().debug).toBe(true);
  });

  // This is somewhat of a side-effect of supporting previous test.
  test('when shared option after subcommand then parsed by subcommand', () => {
    const { program, sub } = makeProgram();
    program.parse(['sub', '-g'], { from: 'user' });
    expect(sub.opts().group).toBe(true);
    expect(program.opts().global).toBeUndefined();
  });
});

// ------------------------------------------------------------------------------

describe('program with allowUnknownOption', () => {
  test('when passThroughOptions and unknown option then arguments from unknown passed through', () => {
    const program = new commander.Command();
    program.passThroughOptions().allowUnknownOption().option('--debug');
    program.argument('[args...]');

    program.parse(['--unknown', '--debug'], { from: 'user' });
    expect(program.args).toEqual(['--unknown', '--debug']);
  });

  test('when positionalOptions and unknown option then known options then known option parsed', () => {
    const program = new commander.Command();
    program.enablePositionalOptions().allowUnknownOption().option('--debug');
    program.argument('[args...]');

    program.parse(['--unknown', '--debug'], { from: 'user' });
    expect(program.opts().debug).toBe(true);
    expect(program.args).toEqual(['--unknown']);
  });
});

// ------------------------------------------------------------------------------

describe('passThroughOptions(xxx) and option after command-argument', () => {
  function makeProgram() {
    const program = new commander.Command();
    program.option('-d, --debug').argument('<args...>');
    return program;
  }

  test('when passThroughOptions() then option passed through', () => {
    const program = makeProgram();
    program.passThroughOptions();
    program.parse(['foo', '--debug'], { from: 'user' });
    expect(program.args).toEqual(['foo', '--debug']);
  });

  test('when passThroughOptions(true) then option passed through', () => {
    const program = makeProgram();
    program.passThroughOptions(true);
    program.parse(['foo', '--debug'], { from: 'user' });
    expect(program.args).toEqual(['foo', '--debug']);
  });

  test('when passThroughOptions(false) then option parsed', () => {
    const program = makeProgram();
    program.passThroughOptions(false);
    program.parse(['foo', '--debug'], { from: 'user' });
    expect(program.args).toEqual(['foo']);
    expect(program.opts().debug).toEqual(true);
  });
});

// ------------------------------------------------------------------------------

describe('enablePositionalOptions(xxx) and shared option after subcommand', () => {
  function makeProgram() {
    const program = new commander.Command();
    program.option('-d, --debug');
    const sub = program.command('sub').option('-d, --debug');
    return { program, sub };
  }

  test('when enablePositionalOptions() then option parsed by subcommand', () => {
    const { program, sub } = makeProgram();
    program.enablePositionalOptions();
    program.parse(['sub', '--debug'], { from: 'user' });
    expect(sub.opts().debug).toEqual(true);
  });

  test('when enablePositionalOptions(true) then option parsed by subcommand', () => {
    const { program, sub } = makeProgram();
    program.enablePositionalOptions(true);
    program.parse(['sub', '--debug'], { from: 'user' });
    expect(sub.opts().debug).toEqual(true);
  });

  test('when enablePositionalOptions(false) then option parsed by program', () => {
    const { program, sub } = makeProgram();
    program.enablePositionalOptions(false);
    program.parse(['sub', '--debug'], { from: 'user' });
    expect(sub.opts().debug).toBeUndefined();
    expect(program.opts().debug).toEqual(true);
  });
});
