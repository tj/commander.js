const commander = require('../');

// Just testing the observable Option behaviour here, actual Help behaviour tested elsewhere.

test('when set helpGroup then stored as helpGroupTitle', () => {
  const opt = new commander.Option('-e, --example');
  const group = 'Example:';
  opt.helpGroup(group);
  expect(opt.helpGroupTitle).toEqual(group);
});
