const commander = require('../');
const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Using outputHelp to simplify testing.

describe('program calls to addHelpText', () => {
  let writeSpy;

  beforeEach((t) => {
    writeSpy = t.mock.method(process.stdout, 'write', () => {});
  });

  test('when "before" string then string before built-in help', () => {
    const program = new commander.Command();
    program.addHelpText('before', 'text');
    program.outputHelp();
    assert.equal(writeSpy.mock.calls[0].arguments[0], 'text\n');
    assert.equal(
      writeSpy.mock.calls[1].arguments[0],
      program.helpInformation(),
    );
  });

  test('when "before" function then function result before built-in help', () => {
    const program = new commander.Command();
    program.addHelpText('before', () => 'text');
    program.outputHelp();
    assert.equal(writeSpy.mock.calls[0].arguments[0], 'text\n');
    assert.equal(
      writeSpy.mock.calls[1].arguments[0],
      program.helpInformation(),
    );
  });

  test('when "before" function returns nothing then no effect', () => {
    const program = new commander.Command();
    program.addHelpText('before', () => {});
    program.outputHelp();
    assert.equal(
      writeSpy.mock.calls[0].arguments[0],
      program.helpInformation(),
    );
  });

  test('when "beforeAll" string then string before built-in help', () => {
    const program = new commander.Command();
    program.addHelpText('beforeAll', 'text');
    program.outputHelp();
    assert.equal(writeSpy.mock.calls[0].arguments[0], 'text\n');
    assert.equal(
      writeSpy.mock.calls[1].arguments[0],
      program.helpInformation(),
    );
  });

  test('when "after" string then string after built-in help', () => {
    const program = new commander.Command();
    program.addHelpText('after', 'text');
    program.outputHelp();
    assert.equal(
      writeSpy.mock.calls[0].arguments[0],
      program.helpInformation(),
    );
    assert.equal(writeSpy.mock.calls[1].arguments[0], 'text\n');
  });

  test('when "afterAll" string then string after built-in help', () => {
    const program = new commander.Command();
    program.addHelpText('afterAll', 'text');
    program.outputHelp();
    assert.equal(
      writeSpy.mock.calls[0].arguments[0],
      program.helpInformation(),
    );
    assert.equal(writeSpy.mock.calls[1].arguments[0], 'text\n');
  });

  test('when all the simple positions then strings in order', () => {
    const program = new commander.Command();
    program.addHelpText('before', 'before');
    program.addHelpText('after', 'after');
    program.addHelpText('beforeAll', 'beforeAll');
    program.addHelpText('afterAll', 'afterAll');
    program.outputHelp();
    assert.equal(writeSpy.mock.calls[0].arguments[0], 'beforeAll\n');
    assert.equal(writeSpy.mock.calls[1].arguments[0], 'before\n');
    assert.equal(
      writeSpy.mock.calls[2].arguments[0],
      program.helpInformation(),
    );
    assert.equal(writeSpy.mock.calls[3].arguments[0], 'after\n');
    assert.equal(writeSpy.mock.calls[4].arguments[0], 'afterAll\n');
  });

  test('when "silly" position then throw', () => {
    const program = new commander.Command();
    assert.throws(() => {
      program.addHelpText('silly', 'text');
    });
  });
});

describe('program and subcommand calls to addHelpText', () => {
  let writeSpy;

  beforeEach((t) => {
    writeSpy = t.mock.method(process.stdout, 'write', () => {});
  });

  test('when "before" on program then not called on subcommand', (t) => {
    const program = new commander.Command();
    const sub = program.command('sub');
    const testMock = t.mock.fn();
    program.addHelpText('before', testMock);
    sub.outputHelp();
    assert.equal(testMock.mock.callCount(), 0);
  });

  test('when "beforeAll" on program then is called on subcommand', (t) => {
    const program = new commander.Command();
    const sub = program.command('sub');
    const testMock = t.mock.fn();
    program.addHelpText('beforeAll', testMock);
    sub.outputHelp();
    assert.equal(testMock.mock.callCount(), 1);
  });

  test('when "after" on program then not called on subcommand', (t) => {
    const program = new commander.Command();
    const sub = program.command('sub');
    const testMock = t.mock.fn();
    program.addHelpText('after', testMock);
    sub.outputHelp();
    assert.equal(testMock.mock.callCount(), 0);
  });

  test('when "afterAll" on program then is called on subcommand', (t) => {
    const program = new commander.Command();
    const sub = program.command('sub');
    const testMock = t.mock.fn();
    program.addHelpText('afterAll', testMock);
    sub.outputHelp();
    assert.equal(testMock.mock.callCount(), 1);
  });
});

describe('context checks with full parse', () => {
  let stdoutSpy;
  let stderrSpy;

  beforeEach((t) => {
    stdoutSpy = t.mock.method(process.stdout, 'write', () => {});
    stderrSpy = t.mock.method(process.stderr, 'write', () => {});
  });

  test('when help requested then text is on stdout', () => {
    const program = new commander.Command();
    program.exitOverride().addHelpText('before', 'text');
    assert.throws(() => {
      program.parse(['--help'], { from: 'user' });
    });
    assert.equal(stdoutSpy.mock.calls[0].arguments[0], 'text\n');
  });

  test('when help for error then text is on stderr', () => {
    const program = new commander.Command();
    program.exitOverride().addHelpText('before', 'text').command('sub');
    assert.throws(() => {
      program.parse([], { from: 'user' });
    });
    assert.equal(stderrSpy.mock.calls[0].arguments[0], 'text\n');
  });

  test('when help requested then context.error is false', () => {
    let context;
    const program = new commander.Command();
    program.exitOverride().addHelpText('before', (contextParam) => {
      context = contextParam;
    });
    assert.throws(() => {
      program.parse(['--help'], { from: 'user' });
    });
    assert.equal(context.error, false);
  });

  test('when help for error then context.error is true', () => {
    let context;
    const program = new commander.Command();
    program
      .exitOverride()
      .addHelpText('before', (contextParam) => {
        context = contextParam;
      })
      .command('sub');
    assert.throws(() => {
      program.parse([], { from: 'user' });
    });
    assert.equal(context.error, true);
  });

  test('when help on program then context.command is program', () => {
    let context;
    const program = new commander.Command();
    program.exitOverride().addHelpText('before', (contextParam) => {
      context = contextParam;
    });
    assert.throws(() => {
      program.parse(['--help'], { from: 'user' });
    });
    assert.equal(context.command, program);
  });

  test('when help on subcommand and "before" subcommand then context.command is subcommand', () => {
    let context;
    const program = new commander.Command();
    program.exitOverride();
    const sub = program.command('sub').addHelpText('before', (contextParam) => {
      context = contextParam;
    });
    assert.throws(() => {
      program.parse(['sub', '--help'], { from: 'user' });
    });
    assert.equal(context.command, sub);
  });

  test('when help on subcommand and "beforeAll" on program then context.command is subcommand', () => {
    let context;
    const program = new commander.Command();
    program.exitOverride().addHelpText('beforeAll', (contextParam) => {
      context = contextParam;
    });
    const sub = program.command('sub');
    assert.throws(() => {
      program.parse(['sub', '--help'], { from: 'user' });
    });
    assert.equal(context.command, sub);
  });
});
