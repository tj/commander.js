const commander = require('../');

test('when set program name and parse then name is as assigned', () => {
  const program = new commander.Command();
  program.name('custom');
  program.parse(['node', 'test']);
  expect(program.name()).toBe('custom');
});

test('when program name not set and parse then name is found from arguments', () => {
  const program = new commander.Command();
  program.parse(['node', 'test']);
  expect(program.name()).toBe('test');
});

test('when add command then command is named', () => {
  const program = new commander.Command();
  const subcommand = program
    .command('mycommand <file>');
  expect(subcommand.name()).toBe('mycommand');
});

test('when set program name then name appears in help', () => {
  const program = new commander.Command();
  program.name('custom-name');
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch(/^Usage: custom-name/);
});
