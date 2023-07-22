const { Command, Option } = require('../');

test('when use cmd.helpGroup then command listed in custom group', () => {
  const program = new Command();
  program.command('foo')
    .description('foo description')
    .helpGroup('Example Command:')
    .action(() => {});
  const helpInfo = program.helpInformation();
  expect(helpInfo).toMatch(/Example Command:\n +foo +foo description\n\n/);
});

test('when use opt:helpGroup with external command then command listed in custom group', () => {
  const program = new Command();
  program.command('foo', 'foo description', { helpGroup: 'Example Command:' });
  const helpInfo = program.helpInformation();
  expect(helpInfo).toMatch(/Example Command:\n +foo +foo description\n\n/);
});

test('when use opt:helpGroup with addCommand then command listed in custom group', () => {
  const program = new Command();
  program.addCommand(new Command('foo').description('foo description').helpGroup('Example Command:'));
  const helpInfo = program.helpInformation();
  expect(helpInfo).toMatch(/Example Command:\n +foo +foo description\n\n/);
});

test('when hidden command with group then group not displayed', () => {
  const program = new Command();
  program.command('hidden', 'hidden description', { helpGroup: 'Hidden Command:', hidden: true });
  const helpInfo = program.helpInformation();
  expect(helpInfo).not.toMatch(/Hidden/);
});

test('when use opt:helpGroup with addHelpCommand then command listed in custom group', () => {
  const program = new Command();
  program.addHelpCommand('help', 'show help', { helpGroup: 'Example Command:' });
  const helpInfo = program.helpInformation();
  expect(helpInfo).toMatch(/Example Command:\n +help +show help\n/);
});

test('when use opt:helpGroup with helpOption then option listed in custom group', () => {
  const program = new Command();
  program.helpOption('-h, --help', 'show help', { helpGroup: 'Example Option:' });
  const helpInfo = program.helpInformation();
  expect(helpInfo).toMatch(/Example Option:\n +-h, --help +show help\n/);
});

test('when sort commands then command groups in creation order and commands sorted in group', () => {
  const program = new Command();
  program.configureHelp({ sortSubcommands: true });
  program.command('z2', 'ZZ', { helpGroup: 'First Group:' });
  program.command('a', 'AA', { helpGroup: 'Second Group:' });
  program.command('z1', 'ZZ', { helpGroup: 'First Group:' });
  const helpInfo = program.helpInformation();
  expect(helpInfo).toMatch(/First Group:\n +z1 +ZZ\n +z2 +ZZ\n\nSecond Group:/);
});

test('when sort options then options groups in creation order and options sorted in group', () => {
  const program = new Command();
  program.configureHelp({ sortOptions: true });
  program.addOption(new Option('-z', 'ZZ').helpGroup('First Group:'));
  program.addOption(new Option('-a', 'AA').helpGroup('Second Group:'));
  program.addOption(new Option('-y', 'YY').helpGroup('First Group:'));
  const helpInfo = program.helpInformation();
  expect(helpInfo).toMatch(/First Group:\n +-y +YY\n +-z + ZZ\n\nSecond Group:/);
});
