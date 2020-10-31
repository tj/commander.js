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

test('when custom write() then help error on custom output', () => {
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

test('when custom writeError then help error on custom output', () => {
  const writeSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => { });
  const customWrite = jest.fn();
  const program = new commander.Command();
  program.configureOutput({ writeError: customWrite });
  program.outputHelp({ error: true });

  expect(writeSpy).toHaveBeenCalledTimes(0);
  expect(customWrite).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when default getColumns then help columns from stdout', () => {
  const expectedColumns = 123;
  const holdIsTTY = process.stdout.isTTY;
  const holdColumns = process.stdout.columns;
  let helpColumns;

  process.stderr.isTTY = true;
  process.stdout.columns = expectedColumns;
  process.stdout.isTTY = true;
  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpColumns = helper.columns;
        return '';
      }
    });
  program.outputHelp();

  expect(helpColumns).toBe(expectedColumns);
  process.stdout.columns = holdColumns;
  process.stdout.isTTY = holdIsTTY;
});

test('when custom getColumns then help columns custom', () => {
  const expectedColumns = 123;
  let helpColumns;

  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpColumns = helper.columns;
        return '';
      }
    }).configureOutput({
      getColumns: () => expectedColumns
    });
  program.outputHelp();

  expect(helpColumns).toBe(expectedColumns);
});

test('when default getErrorColumns then help error columns from stderr', () => {
  const expectedColumns = 123;
  const holdIsTTY = process.stderr.isTTY;
  const holdColumns = process.stderr.columns;
  let helpColumns;

  process.stderr.isTTY = true;
  process.stderr.columns = expectedColumns;
  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpColumns = helper.columns;
        return '';
      }
    });
  program.outputHelp({ error: true });

  expect(helpColumns).toBe(expectedColumns);
  process.stderr.isTTY = holdIsTTY;
  process.stderr.columns = holdColumns;
});

test('when custom getErrorColumns then help error columns custom', () => {
  const expectedColumns = 123;
  let helpColumns;

  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpColumns = helper.columns;
        return '';
      }
    }).configureOutput({
      getErrorColumns: () => expectedColumns
    });
  program.outputHelp({ error: true });

  expect(helpColumns).toBe(expectedColumns);
});

test('when custom getColumns and configureHelp:columns then help columns from configureHelp', () => {
  const expectedColumns = 123;
  let helpColumns;

  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpColumns = helper.columns;
        return '';
      },
      columns: expectedColumns
    }).configureOutput({
      getColumns: () => 999
    });
  program.outputHelp();

  expect(helpColumns).toBe(expectedColumns);
});
