const commander = require('../');

describe.skip('open issues', () => {
  test('#1039: when unknown option then unknown option detected', () => {
    const program = new commander.Command();
    program
      ._exitOverride();
    expect(() => {
      program.parse(['node', 'text', '--bug']);
    }).toThrow();
  });

  test('#1039: when unknown option and multiple arguments then unknown option detected', () => {
    const program = new commander.Command();
    program
      ._exitOverride();
    expect(() => {
      program.parse(['node', 'text', '--bug', '0', '1', '2', '3']);
    }).toThrow();
  });
});
