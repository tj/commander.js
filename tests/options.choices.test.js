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
