const commander = require('../');

// Test for backwards compatible behaviour of deprecated features that don't fit in elsewhere.
// We keep deprecated features working (when not too difficult) to avoid breaking existing code
// and reduce barriers to updating to latest version of Commander.

describe('option with regular expression instead of custom processing function', () => {
  test('when option not given then value is default', () => {
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type', /mild|tasty/, 'mild');
    program.parse([], { from: 'user' });
    expect(program.opts().cheese).toEqual('mild');
  });

  test('when argument matches regexp then value is as specified', () => {
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type', /mild|tasty/, 'mild');
    program.parse(['--cheese', 'tasty'], { from: 'user' });
    expect(program.opts().cheese).toEqual('tasty');
  });

  test('when argument does not match regexp then value is default', () => {
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type', /mild|tasty/, 'mild');
    program.parse(['--cheese', 'other'], { from: 'user' });
    expect(program.opts().cheese).toEqual('mild');
  });
});
