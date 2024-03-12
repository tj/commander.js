const commander = require('../');

test('when default configuration then return empty array', () => {
  const program = new commander.Command();
  program.option('--global');
  const sub = program.command('sub');
  const helper = sub.createHelp();
  expect(helper.visibleGlobalOptions(program)).toEqual([]);
});

test('when showGlobalOptions:true then return program options', () => {
  const program = new commander.Command();
  program.option('--global').configureHelp({ showGlobalOptions: true });
  const sub = program.command('sub');
  const helper = sub.createHelp();
  const visibleOptionNames = helper
    .visibleGlobalOptions(sub)
    .map((option) => option.name());
  expect(visibleOptionNames).toEqual(['global']);
});

test('when showGlobalOptions:true and program has version then return version', () => {
  const program = new commander.Command();
  program.configureHelp({ showGlobalOptions: true }).version('1.2.3');
  const sub = program.command('sub');
  const helper = sub.createHelp();
  const visibleOptionNames = helper
    .visibleGlobalOptions(sub)
    .map((option) => option.name());
  expect(visibleOptionNames).toEqual(['version']);
});

test('when showGlobalOptions:true and nested commands then return combined global options', () => {
  const program = new commander.Command();
  program.configureHelp({ showGlobalOptions: true }).option('--global');
  const sub1 = program.command('sub1').option('--sub1');
  const sub2 = sub1.command('sub2');
  const helper = sub2.createHelp();
  const visibleOptionNames = helper
    .visibleGlobalOptions(sub2)
    .map((option) => option.name());
  expect(visibleOptionNames).toEqual(['sub1', 'global']);
});
