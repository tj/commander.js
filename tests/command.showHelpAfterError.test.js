const commander = require('../');

describe('showHelpAfterError with message', () => {
  const customHelpMessage = 'See --help';

  function makeProgram() {
    const writeMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .showHelpAfterError(customHelpMessage)
      .configureOutput({ writeErr: writeMock });

    return { program, writeMock };
  }

  test('when missing command-argument then shows help', () => {
    const { program, writeMock } = makeProgram();
    program.argument('<file>');
    let caughtErr;
    try {
      program.parse([], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.missingArgument');
    expect(writeMock).toHaveBeenLastCalledWith(`${customHelpMessage}\n`);
  });

  test('when missing option-argument then shows help', () => {
    const { program, writeMock } = makeProgram();
    program.option('--output <file>');
    let caughtErr;
    try {
      program.parse(['--output'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.optionMissingArgument');
    expect(writeMock).toHaveBeenLastCalledWith(`${customHelpMessage}\n`);
  });

  test('when missing mandatory option then shows help', () => {
    const { program, writeMock } = makeProgram();
    program.requiredOption('--password <cipher>');
    let caughtErr;
    try {
      program.parse([], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.missingMandatoryOptionValue');
    expect(writeMock).toHaveBeenLastCalledWith(`${customHelpMessage}\n`);
  });

  test('when unknown option then shows help', () => {
    const { program, writeMock } = makeProgram();
    let caughtErr;
    try {
      program.parse(['--unknown-option'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
    expect(writeMock).toHaveBeenLastCalledWith(`${customHelpMessage}\n`);
  });

  test('when too many command-arguments then shows help', () => {
    const { program, writeMock } = makeProgram();
    program
      .allowExcessArguments(false);
    let caughtErr;
    try {
      program.parse(['surprise'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.excessArguments');
    expect(writeMock).toHaveBeenLastCalledWith(`${customHelpMessage}\n`);
  });

  test('when unknown command then shows help', () => {
    const { program, writeMock } = makeProgram();
    program.command('sub1');
    let caughtErr;
    try {
      program.parse(['sub2'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownCommand');
    expect(writeMock).toHaveBeenLastCalledWith(`${customHelpMessage}\n`);
  });

  test('when invalid option choice then shows help', () => {
    const { program, writeMock } = makeProgram();
    program.addOption(new commander.Option('--color').choices(['red', 'blue']));
    let caughtErr;
    try {
      program.parse(['--color', 'pink'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.invalidArgument');
    expect(writeMock).toHaveBeenLastCalledWith(`${customHelpMessage}\n`);
  });
});

test('when showHelpAfterError() and error and then shows full help', () => {
  const writeMock = jest.fn();
  const program = new commander.Command();
  program
    .exitOverride()
    .showHelpAfterError()
    .configureOutput({ writeErr: writeMock });

  try {
    program.parse(['--unknown-option'], { from: 'user' });
  } catch (err) {
  }
  expect(writeMock).toHaveBeenLastCalledWith(program.helpInformation());
});
