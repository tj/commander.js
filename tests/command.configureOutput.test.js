const commander = require('../');

test('when default writeError() then error on stderr', () => {
  const writeSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => { });
  const program = new commander.Command();
  program.exitOverride();

  try {
    program.parse(['--unknown'], { from: 'user' });
  } catch (err) {
  }

  expect(writeSpy).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when custom writeError() then error on custom output', () => {
  const writeSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => { });
  const customWrite = jest.fn();
  const program = new commander.Command();
  program
    .exitOverride()
    .configureOutput({ writeError: customWrite });

  try {
    program.parse(['--unknown'], { from: 'user' });
  } catch (err) {
  }

  expect(writeSpy).toHaveBeenCalledTimes(0);
  expect(customWrite).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when default write() then version on stdout', () => {
  const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  const program = new commander.Command();
  program
    .exitOverride()
    .version('1.2.3');

  expect(() => {
    program.parse(['--version'], { from: 'user' });
  }).toThrow();

  expect(writeSpy).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when custom write() then version on custom output', () => {
  const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  const customWrite = jest.fn();
  const program = new commander.Command();
  program
    .exitOverride()
    .version('1.2.3')
    .configureOutput({ write: customWrite });

  expect(() => {
    program.parse(['--version'], { from: 'user' });
  }).toThrow();

  expect(writeSpy).toHaveBeenCalledTimes(0);
  expect(customWrite).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when default write() then help on stdout', () => {
  const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  const program = new commander.Command();
  program.outputHelp();

  expect(writeSpy).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when custom write() then help error on stdout', () => {
  const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  const customWrite = jest.fn();
  const program = new commander.Command();
  program.configureOutput({ write: customWrite });
  program.outputHelp();

  expect(writeSpy).toHaveBeenCalledTimes(0);
  expect(customWrite).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when default writeError then help error on stderr', () => {
  const writeSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => { });
  const program = new commander.Command();
  program.outputHelp({ error: true });

  expect(writeSpy).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when custom writeError then help error on stderr', () => {
  const writeSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => { });
  const customWrite = jest.fn();
  const program = new commander.Command();
  program.configureOutput({ writeError: customWrite });
  program.outputHelp({ error: true });

  expect(writeSpy).toHaveBeenCalledTimes(0);
  expect(customWrite).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});
