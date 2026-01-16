import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as commander from '../index.js';
import process from 'node:process';

describe('Command.configureOutput()', () => {
  test('when default writeErr() then error on stderr', (t) => {
    const writeSpy = t.mock.method(process.stderr, 'write', () => {});
    const program = new commander.Command();
    program.exitOverride();

    try {
      program.parse(['--unknown'], { from: 'user' });
    } catch (err) {
      /* empty */
    }

    assert.equal(writeSpy.mock.callCount(), 1);
  });

  test('when custom writeErr() then error on custom output', (t) => {
    const writeSpy = t.mock.method(process.stderr, 'write', () => {});
    const customWrite = t.mock.fn();
    const program = new commander.Command();
    program.exitOverride().configureOutput({ writeErr: customWrite });

    try {
      program.parse(['--unknown'], { from: 'user' });
    } catch (err) {
      /* empty */
    }

    assert.equal(writeSpy.mock.callCount(), 0);
    assert.equal(customWrite.mock.callCount(), 1);
  });

  test('when default write() then version on stdout', (t) => {
    const writeSpy = t.mock.method(process.stdout, 'write', () => {});
    const program = new commander.Command();
    program.exitOverride().version('1.2.3');

    assert.throws(() => {
      program.parse(['--version'], { from: 'user' });
    });

    assert.equal(writeSpy.mock.callCount(), 1);
  });

  test('when custom write() then version on custom output', (t) => {
    const writeSpy = t.mock.method(process.stdout, 'write', () => {});
    const customWrite = t.mock.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .version('1.2.3')
      .configureOutput({ writeOut: customWrite });

    assert.throws(() => {
      program.parse(['--version'], { from: 'user' });
    });

    assert.equal(writeSpy.mock.callCount(), 0);
    assert.equal(customWrite.mock.callCount(), 1);
  });

  test('when default write() then help on stdout', (t) => {
    const writeSpy = t.mock.method(process.stdout, 'write', () => {});
    const program = new commander.Command();
    program.outputHelp();

    assert.equal(writeSpy.mock.callCount(), 1);
  });

  test('when custom write() then help error on custom output', (t) => {
    const writeSpy = t.mock.method(process.stdout, 'write', () => {});
    const customWrite = t.mock.fn();
    const program = new commander.Command();
    program.configureOutput({ writeOut: customWrite });
    program.outputHelp();

    assert.equal(writeSpy.mock.callCount(), 0);
    assert.equal(customWrite.mock.callCount(), 1);
  });

  test('when default writeErr then help error on stderr', (t) => {
    const writeSpy = t.mock.method(process.stderr, 'write', () => {});
    const program = new commander.Command();
    program.outputHelp({ error: true });

    assert.equal(writeSpy.mock.callCount(), 1);
  });

  test('when custom writeErr then help error on custom output', (t) => {
    const writeSpy = t.mock.method(process.stderr, 'write', () => {});
    const customWrite = t.mock.fn();
    const program = new commander.Command();
    program.configureOutput({ writeErr: customWrite });
    program.outputHelp({ error: true });

    assert.equal(writeSpy.mock.callCount(), 0);
    assert.equal(customWrite.mock.callCount(), 1);
  });

  test('when default getOutHelpWidth then help helpWidth from stdout', () => {
    const expectedColumns = 123;
    const holdIsTTY = process.stdout.isTTY;
    const holdColumns = process.stdout.columns;
    let helpWidth;

    process.stderr.isTTY = true;
    process.stdout.columns = expectedColumns;
    process.stdout.isTTY = true;
    const program = new commander.Command();
    program.configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      },
    });
    program.outputHelp();

    assert.equal(helpWidth, expectedColumns);
    process.stdout.columns = holdColumns;
    process.stdout.isTTY = holdIsTTY;
  });

  test('when custom getOutHelpWidth then help helpWidth custom', () => {
    const expectedColumns = 123;
    let helpWidth;

    const program = new commander.Command();
    program
      .configureHelp({
        formatHelp: (cmd, helper) => {
          helpWidth = helper.helpWidth;
          return '';
        },
      })
      .configureOutput({
        getOutHelpWidth: () => expectedColumns,
      });
    program.outputHelp();

    assert.equal(helpWidth, expectedColumns);
  });

  test('when default getErrHelpWidth then help error helpWidth from stderr', () => {
    const expectedColumns = 123;
    const holdIsTTY = process.stderr.isTTY;
    const holdColumns = process.stderr.columns;
    let helpWidth;

    process.stderr.isTTY = true;
    process.stderr.columns = expectedColumns;
    const program = new commander.Command();
    program.configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      },
    });
    program.outputHelp({ error: true });

    assert.equal(helpWidth, expectedColumns);
    process.stderr.isTTY = holdIsTTY;
    process.stderr.columns = holdColumns;
  });

  test('when custom getErrHelpWidth then help error helpWidth custom', () => {
    const expectedColumns = 123;
    let helpWidth;

    const program = new commander.Command();
    program
      .configureHelp({
        formatHelp: (cmd, helper) => {
          helpWidth = helper.helpWidth;
          return '';
        },
      })
      .configureOutput({
        getErrHelpWidth: () => expectedColumns,
      });
    program.outputHelp({ error: true });

    assert.equal(helpWidth, expectedColumns);
  });

  test('when custom getOutHelpWidth and configureHelp:helpWidth then help helpWidth from configureHelp', () => {
    const expectedColumns = 123;
    let helpWidth;

    const program = new commander.Command();
    program
      .configureHelp({
        formatHelp: (cmd, helper) => {
          helpWidth = helper.helpWidth;
          return '';
        },
        helpWidth: expectedColumns,
      })
      .configureOutput({
        getOutHelpWidth: () => 999,
      });
    program.outputHelp();

    assert.equal(helpWidth, expectedColumns);
  });

  test('when custom getErrHelpWidth and configureHelp:helpWidth then help error helpWidth from configureHelp', () => {
    const expectedColumns = 123;
    let helpWidth;

    const program = new commander.Command();
    program
      .configureHelp({
        formatHelp: (cmd, helper) => {
          helpWidth = helper.helpWidth;
          return '';
        },
        helpWidth: expectedColumns,
      })
      .configureOutput({
        getErrHelpWidth: () => 999,
      });
    program.outputHelp({ error: true });

    assert.equal(helpWidth, expectedColumns);
  });

  test('when no custom setup and call formatHelp direct then effective helpWidth is fallback 80', () => {
    // Not an important case, but filling out testing coverage.
    const helper = new commander.Help();
    let wrapWidth;
    helper.boxWrap = (str, width) => {
      wrapWidth = wrapWidth ?? width;
      return '';
    };
    const program = new commander.Command()
      .description('description')
      .helpOption(false);
    helper.formatHelp(program, helper);
    assert.equal(wrapWidth, 80);
  });

  test('when no custom setup and call formatItem direct then effective helpWidth is fallback 80', () => {
    // Not an important case, but filling out testing coverage.
    const helper = new commander.Help();
    let wrapWidth;
    helper.boxWrap = (str, width) => {
      wrapWidth = wrapWidth ?? width;
      return '';
    };

    const termWidth = 8;
    helper.formatItem('term', termWidth, 'description', helper);
    const itemIndent = 2;
    const spacerWidth = 2; // between term and description
    const remainingWidth = 80 - termWidth - spacerWidth - itemIndent;

    assert.equal(wrapWidth, remainingWidth);
  });

  test('when set configureOutput then get configureOutput', (t) => {
    const outputOptions = {
      writeOut: t.mock.fn(),
      writeErr: t.mock.fn(),
      getOutHelpWidth: t.mock.fn(),
      getErrHelpWidth: t.mock.fn(),
      getOutHasColors: t.mock.fn(),
      getErrHasColors: t.mock.fn(),
      outputError: t.mock.fn(),
      stripColor: t.mock.fn(),
    };
    const program = new commander.Command();
    program.configureOutput(outputOptions);
    assert.deepEqual(program.configureOutput(), outputOptions);
  });

  test('when custom outputErr and error then outputErr called', (t) => {
    const outputError = t.mock.fn();
    const program = new commander.Command();
    program.exitOverride().configureOutput({
      outputError,
    });

    assert.throws(() => {
      program.parse(['--unknownOption'], { from: 'user' });
    });
    assert.equal(
      outputError.mock.calls[0].arguments[0],
      "error: unknown option '--unknownOption'\n",
    );
    assert.equal(
      outputError.mock.calls[0].arguments[1],
      program._outputConfiguration.writeErr,
    );
  });

  test('when custom outputErr and writeErr and error then outputErr passed writeErr', (t) => {
    const writeErr = () => t.mock.fn();
    const outputError = t.mock.fn();
    const program = new commander.Command();
    program.exitOverride().configureOutput({ writeErr, outputError });

    assert.throws(() => {
      program.parse(['--unknownOption'], { from: 'user' });
    });
    assert.equal(
      outputError.mock.calls[0].arguments[0],
      "error: unknown option '--unknownOption'\n",
    );
    assert.equal(outputError.mock.calls[0].arguments[1], writeErr);
  });

  test('when configureOutput after copyInheritedSettings then original unchanged', () => {
    const program = new commander.Command();
    program.configureOutput({ getOutHelpWidth: () => 80 });
    const copy = program.createCommand('copy');
    copy.copyInheritedSettings(program);
    assert.equal(copy.configureOutput().getOutHelpWidth(), 80);
    copy.configureOutput({ getOutHelpWidth: () => 40 });
    assert.equal(copy.configureOutput().getOutHelpWidth(), 40);
    assert.equal(program.configureOutput().getOutHelpWidth(), 80);
  });

  describe('environment variable tests', () => {
    [
      ['NO_COLOR', false],
      ['FORCE_COLOR', true],
      ['CLICOLOR_FORCE', true],
    ].forEach(([envvar, expected]) => {
      test(`when ${envvar} then getFooHasColors returns ${expected}`, () => {
        // Would like to vary process.istty too, but too hard, so tests here provide only partial cover.
        const holdEnv = process.env[envvar];
        process.env[envvar] = '1';
        const config = new commander.Command().configureOutput();
        assert.equal(config.getOutHasColors(), expected);
        assert.equal(config.getErrHasColors(), expected);
        if (holdEnv === undefined) delete process.env[envvar];
        else process.env[envvar] = holdEnv;
      });
    });
  });
});
