const commander = require('../');

test('when option argument in choices then option set', () => {
  const program = new commander.Command();
  program
    .exitOverride()
    .addOption(
      new commander.Option('--colour <shade>').choices(['red', 'blue']),
    );
  program.parse(['--colour', 'red'], { from: 'user' });
  expect(program.opts().colour).toBe('red');
});

test('when option argument is not in choices then error', () => {
  // Lightweight check, more detailed testing of behaviour in command.exitOverride.test.js
  const program = new commander.Command();
  program
    .exitOverride()
    .configureOutput({
      writeErr: () => {},
    })
    .addOption(
      new commander.Option('--colour <shade>').choices(['red', 'blue']),
    );
  expect(() => {
    program.parse(['--colour', 'orange'], { from: 'user' });
  }).toThrow();
});

describe('choices parameter is treated as readonly, per TypeScript declaration', () => {
  test('when choices called then parameter does not change', () => {
    // Unlikely this could break, but check the API we are declaring in TypeScript.
    const original = ['red', 'blue', 'green'];
    const param = original.slice();
    new commander.Option('--colour <shade>').choices(param);
    expect(param).toEqual(original);
  });

  test('when choices called and argChoices later changed then parameter does not change', () => {
    const original = ['red', 'blue', 'green'];
    const param = original.slice();
    const option = new commander.Option('--colour <shade>').choices(param);
    option.argChoices.push('purple');
    expect(param).toEqual(original);
  });

  test('when choices called and parameter changed the choices does not change', () => {
    const program = new commander.Command();
    const param = ['red', 'blue'];
    program
      .exitOverride()
      .configureOutput({
        writeErr: () => {},
      })
      .addOption(new commander.Option('--colour <shade>').choices(param));
    param.push('orange');
    expect(() => {
      program.parse(['--colour', 'orange'], { from: 'user' });
    }).toThrow();
  });
});

test('optional choice followed by an optional argument', () => {
  const program = new commander.Command();
  const command = program
    .command('test [test-filter]')
    .addOption(
      new commander.Option('--update-snapshots [value]').choices(['all', 'missing', 'none']),
    );
  program.parse(['test', '--update-snapshots', 'tests/test.e2e.ts:23'], { from: 'user' });
  expect(command.opts().updateSnapshots).toBe(true);
  expect(command.args).toEqual(['tests/test.e2e.ts:23']);
});

test('optional choice without a value and unsupported argument is an error', () => {
  const program = new commander.Command();
  program
    .exitOverride()
    .command('test')
    .addOption(
      new commander.Option('--update-snapshots [value]').choices(['all', 'missing', 'none']),
    );
  expect(() => {
    program.parse(['test', '--update-snapshots', 'foo'], { from: 'user' });
  }).toThrow(`error: too many arguments for 'test'. Expected 0 arguments but got 1.`);
});

test('optional choice with preset followed by an optional variadic argument', () => {
  const program = new commander.Command();
  const command = program
    .command('test [test-filter...]')
    .addOption(
      new commander.Option('-u, --update-snapshots [value]').choices(['all', 'missing', 'none']).preset('missing'),
    );
  program.parse(['test', '-u', 'foo.spec.ts', 'bar.spec.ts'], { from: 'user' });
  expect(command.opts().updateSnapshots).toBe('missing');
  expect(command.args).toEqual(['foo.spec.ts', 'bar.spec.ts']);
});

test('optional choice as last option', () => {
  const program = new commander.Command();
  const command = program
    .command('test [test-filter...]')
    .addOption(
      new commander.Option('-u, --update-snapshots [value]').choices(['all', 'missing', 'none']).preset('missing'),
    );
  program.parse(['test', '--update-snapshots'], { from: 'user' });
  expect(command.opts().updateSnapshots).toBe('missing');
});
