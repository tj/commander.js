const commander = require('../');

test('when error called with message then message displayed on stderr', () => {
  const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  const stderrSpy = jest
    .spyOn(process.stderr, 'write')
    .mockImplementation(() => {});

  const program = new commander.Command();
  const message = 'Goodbye';
  program.error(message);

  expect(stderrSpy).toHaveBeenCalledWith(`${message}\n`);
  stderrSpy.mockRestore();
  exitSpy.mockRestore();
});

test('when error called with no exitCode then process.exit(1)', () => {
  const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

  const program = new commander.Command();
  program.configureOutput({
    writeErr: () => {},
  });

  program.error('Goodbye');

  expect(exitSpy).toHaveBeenCalledWith(1);
  exitSpy.mockRestore();
});

test('when error called with exitCode 2 then process.exit(2)', () => {
  const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

  const program = new commander.Command();
  program.configureOutput({
    writeErr: () => {},
  });
  program.error('Goodbye', { exitCode: 2 });

  expect(exitSpy).toHaveBeenCalledWith(2);
  exitSpy.mockRestore();
});

test('when error called with code and exitOverride then throws with code', () => {
  const program = new commander.Command();
  let errorThrown;
  program
    .exitOverride((err) => {
      errorThrown = err;
      throw err;
    })
    .configureOutput({
      writeErr: () => {},
    });

  const code = 'commander.test';
  expect(() => {
    program.error('Goodbye', { code });
  }).toThrow();
  expect(errorThrown.code).toEqual(code);
});
