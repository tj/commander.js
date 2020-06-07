const commander = require('../');

// Check detection of likely name clashes

test('when option clashes with property then throw', () => {
  const program = new commander.Command();
  expect(() => {
    program.option('-n, --name <name>');
  }).toThrow();
});

test('when option clashes with property and storeOptionsAsProperties(true) then ok', () => {
  const program = new commander.Command();
  program.storeOptionsAsProperties(true);
  expect(() => {
    program.option('-n, --name <name>');
  }).not.toThrow();
});

test('when option would clash with property but storeOptionsAsProperties(false) then ok', () => {
  const program = new commander.Command();
  program.storeOptionsAsProperties(false);
  expect(() => {
    program.option('-n, --name <name>');
  }).not.toThrow();
});

test('when negated option clashes with property then throw', () => {
  const program = new commander.Command();
  expect(() => {
    program.option('-E, --no-emit');
  }).toThrow();
});

test('when positive and negative option then ok', () => {
  const program = new commander.Command();
  expect(() => {
    program
      .option('-c, --colour', 'red')
      .option('-C, --no-colour');
  }).not.toThrow();
});

test('when negative and positive option then ok', () => {
  // Not a likely pattern, but possible and not an error.
  const program = new commander.Command();
  expect(() => {
    program
      .option('-C, --no-colour')
      .option('-c, --colour');
  }).not.toThrow();
});
