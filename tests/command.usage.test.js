const commander = require('../');

test('when default usage and check program help then starts with default usage', () => {
  const program = new commander.Command();

  program.name('test');
  const helpInformation = program.helpInformation();

  expect(helpInformation).toMatch(/^Usage: test \[options\]/);
});

test('when custom usage and check program help then starts with custom usage', () => {
  const myUsage = 'custom';
  const program = new commander.Command();
  program.usage(myUsage);

  program.name('test');
  const helpInformation = program.helpInformation();

  expect(helpInformation).toMatch(new RegExp(`^Usage: test ${myUsage}`));
});

test('when default usage and check subcommand help then starts with default usage including program name', () => {
  const program = new commander.Command();
  const subCommand = program.command('info');

  program.name('test');
  const helpInformation = subCommand.helpInformation();

  expect(helpInformation).toMatch(/^Usage: test info \[options\]/);
});

test('when custom usage and check subcommand help then starts with custom usage including program name', () => {
  const myUsage = 'custom';
  const program = new commander.Command();
  const subCommand = program.command('info').usage(myUsage);

  program.name('test');
  const helpInformation = subCommand.helpInformation();

  expect(helpInformation).toMatch(new RegExp(`^Usage: test info ${myUsage}`));
});

test('when has option then [options] included in usage', () => {
  const program = new commander.Command();

  program.option('--foo');

  expect(program.usage()).toMatch('[options]');
});

test('when no options then [options] not included in usage', () => {
  const program = new commander.Command();

  program.helpOption(false);

  expect(program.usage()).not.toMatch('[options]');
});

test('when has command then [command] included in usage', () => {
  const program = new commander.Command();

  program.command('foo');

  expect(program.usage()).toMatch('[command]');
});

test('when no commands then [command] not included in usage', () => {
  const program = new commander.Command();

  expect(program.usage()).not.toMatch('[command]');
});

test('when argument then argument included in usage', () => {
  const program = new commander.Command();

  program.argument('<file>');

  expect(program.usage()).toMatch('<file>');
});

test('when options and command and argument then all three included in usage', () => {
  const program = new commander.Command();

  program.argument('<file>').option('--alpha').command('beta');

  expect(program.usage()).toEqual('[options] [command] <file>');
});
