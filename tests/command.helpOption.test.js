const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('helpOption', () => {
  test('when helpOption has custom flags then custom short flag invokes help', (t) => {
    const writeSpy = t.mock.method(process.stdout, 'write', () => {});
    const program = new commander.Command();
    program.exitOverride().helpOption('-c,--custom-help', 'custom help output');
    assert.throws(
      () => {
        program.parse(['-c'], { from: 'user' });
      },
      { message: '(outputHelp)' },
    );
  });

  test('when helpOption has custom flags then custom long flag invokes help', (t) => {
    const writeSpy = t.mock.method(process.stdout, 'write', () => {});
    const program = new commander.Command();
    program.exitOverride().helpOption('-c,--custom-help', 'custom help output');
    assert.throws(
      () => {
        program.parse(['--custom-help'], { from: 'user' });
      },
      { message: '(outputHelp)' },
    );
  });

  test('when helpOption has just custom short flag then custom short flag invokes help', (t) => {
    const writeSpy = t.mock.method(process.stdout, 'write', () => {});
    const program = new commander.Command();
    program.exitOverride().helpOption('-c', 'custom help output');
    assert.throws(
      () => {
        program.parse(['-c'], { from: 'user' });
      },
      { message: '(outputHelp)' },
    );
  });

  test('when helpOption has just custom long flag then custom long flag invokes help', (t) => {
    const writeSpy = t.mock.method(process.stdout, 'write', () => {});
    const program = new commander.Command();
    program.exitOverride().helpOption('--custom-help', 'custom help output');
    assert.throws(
      () => {
        program.parse(['--custom-help'], { from: 'user' });
      },
      { message: '(outputHelp)' },
    );
  });

  test('when helpOption has custom description then helpInformation include custom description', () => {
    const program = new commander.Command();
    program.helpOption('-C,--custom-help', 'custom help output');
    const helpInformation = program.helpInformation();
    assert.match(helpInformation, /-C,--custom-help +custom help output/);
  });

  test('when helpOption has just flags then helpInformation includes default description', () => {
    const program = new commander.Command();
    program.helpOption('-C,--custom-help');
    const helpInformation = program.helpInformation();
    assert.match(helpInformation, /-C,--custom-help +display help for command/);
  });

  test('when helpOption has just description then helpInformation includes default flags', () => {
    const program = new commander.Command();
    program.helpOption(undefined, 'custom help output');
    const helpInformation = program.helpInformation();
    assert.match(helpInformation, /-h, --help +custom help output/);
  });

  test('when helpOption(false) then helpInformation does not include --help', () => {
    const program = new commander.Command();
    program.helpOption(false);
    const helpInformation = program.helpInformation();
    assert(!helpInformation.includes('--help'));
  });

  test('when helpOption(false) then --help is an unknown option', (t) => {
    const writeSpy = t.mock.method(process.stderr, 'write', () => {});
    const program = new commander.Command();
    program.exitOverride().helpOption(false);
    let caughtErr;
    try {
      program.parse(['--help'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    assert.equal(caughtErr.code, 'commander.unknownOption');
  });

  test('when helpOption(false) then -h is an unknown option', (t) => {
    const writeSpy = t.mock.method(process.stderr, 'write', () => {});
    const program = new commander.Command();
    program.exitOverride().helpOption(false);
    let caughtErr;
    try {
      program.parse(['-h'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    assert.equal(caughtErr.code, 'commander.unknownOption');
  });

  test('when helpOption(false) then unknown command error does not suggest --help', (t) => {
    const writeSpy = t.mock.method(process.stderr, 'write', () => {});
    const program = new commander.Command();
    program.exitOverride().helpOption(false).command('foo');
    assert.throws(
      () => {
        program.parse(['UNKNOWN'], { from: 'user' });
      },
      { message: "error: unknown command 'UNKNOWN'" },
    );
  });

  test('when helpOption(true) after false then helpInformation does include --help', () => {
    const program = new commander.Command();
    program.helpOption(false);
    program.helpOption(true);
    const helpInformation = program.helpInformation();
    assert(helpInformation.includes('--help'));
  });

  test('when helpOption(true) after customise then helpInformation still customised', () => {
    const program = new commander.Command();
    program.helpOption('--ASSIST');
    program.helpOption(true);
    const helpInformation = program.helpInformation();
    assert(helpInformation.includes('--ASSIST'));
  });
});
