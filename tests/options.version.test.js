const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Test .version. Using exitOverride to check behaviour (instead of mocking process.exit).

describe('.version', () => {
  test('when no .version and specify --version then unknown option error', () => {
    const program = new commander.Command();
    program.exitOverride().configureOutput({ writeErr: () => {} });

    assert.throws(
      () => {
        program.parse(['node', 'test', '--version']);
      },
      { code: 'commander.unknownOption' },
    );
  });

  test('when no .version then helpInformation does not include version', () => {
    const program = new commander.Command();

    const helpInformation = program.helpInformation();

    assert.equal(helpInformation.includes('Usage'), true);
    assert.equal(helpInformation.includes('version'), false);
  });

  test('when specify default short flag then display version', (t) => {
    const myVersion = '1.2.3';
    const writeMock = t.mock.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion);

    assert.throws(() => {
      program.parse(['node', 'test', '-V']);
    }, new RegExp(myVersion));
    const callArgs = writeMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], `${myVersion}\n`);
  });

  test('when specify default long flag then display version', (t) => {
    const myVersion = '1.2.3';
    const writeMock = t.mock.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion);

    assert.throws(() => {
      program.parse(['node', 'test', '--version']);
    }, new RegExp(myVersion));
    const callArgs = writeMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], `${myVersion}\n`);
  });

  test('when default .version then helpInformation includes default version help', () => {
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program.version(myVersion);

    const helpInformation = program.helpInformation();

    assert.equal(helpInformation.includes('-V, --version'), true);
    assert.equal(helpInformation.includes('output the version number'), true);
  });

  test('when specify custom short flag then display version', (t) => {
    const myVersion = '1.2.3';
    const writeMock = t.mock.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '-r, --revision');

    assert.throws(() => {
      program.parse(['node', 'test', '-r']);
    }, new RegExp(myVersion));
    const callArgs = writeMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], `${myVersion}\n`);
  });

  test('when specify just custom short flag then display version', (t) => {
    const myVersion = '1.2.3';
    const writeMock = t.mock.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '-r');

    assert.throws(() => {
      program.parse(['node', 'test', '-r']);
    }, new RegExp(myVersion));
    const callArgs = writeMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], `${myVersion}\n`);
  });

  test('when specify custom long flag then display version', (t) => {
    const myVersion = '1.2.3';
    const writeMock = t.mock.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '-r, --revision');

    assert.throws(() => {
      program.parse(['node', 'test', '--revision']);
    }, new RegExp(myVersion));
    const callArgs = writeMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], `${myVersion}\n`);
  });

  test('when specify just custom long flag then display version', (t) => {
    const myVersion = '1.2.3';
    const writeMock = t.mock.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '--revision');

    assert.throws(() => {
      program.parse(['node', 'test', '--revision']);
    }, new RegExp(myVersion));
    const callArgs = writeMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], `${myVersion}\n`);
  });

  test('when custom .version then helpInformation includes custom version help', () => {
    const myVersion = '1.2.3';
    const myVersionFlags = '-r, --revision';
    const myVersionDescription = 'custom description';
    const program = new commander.Command();
    program.version(myVersion, myVersionFlags, myVersionDescription);

    const helpInformation = program.helpInformation();

    assert.equal(helpInformation.includes(myVersionFlags), true);
    assert.equal(helpInformation.includes(myVersionDescription), true);
  });

  test('when have .version+version and specify version then command called', (t) => {
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    program.version('1.2.3').command('version').action(actionMock);

    program.parse(['node', 'test', 'version']);

    assert.equal(actionMock.mock.callCount(), 1);
  });

  test('when have .version+version and specify --version then version displayed', (t) => {
    const myVersion = '1.2.3';
    const writeMock = t.mock.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion)
      .command('version')
      .action(() => {});

    assert.throws(() => {
      program.parse(['node', 'test', '--version']);
    }, new RegExp(myVersion));
    const callArgs = writeMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], `${myVersion}\n`);
  });

  test('when specify version then can get version', () => {
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program.version(myVersion);
    assert.equal(program.version(), myVersion);
  });
});
