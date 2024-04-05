const commander = require('../');

test('when default configuration then global options hidden', () => {
  const program = new commander.Command();
  program.option('--global');
  const sub = program.command('sub');
  expect(sub.helpInformation()).not.toContain('global');
});

test('when showGlobalOptions:true then program options shown', () => {
  const program = new commander.Command();
  program.option('--global').configureHelp({ showGlobalOptions: true });
  const sub = program.command('sub');
  expect(sub.helpInformation()).toContain('global');
});

test('when showGlobalOptions:true and no global options then global options header not shown', () => {
  const program = new commander.Command();
  program.configureHelp({ showGlobalOptions: true });
  const sub = program.command('sub');
  expect(sub.helpInformation()).not.toContain('Global');
});

test('when showGlobalOptions:true and nested commands then combined nested options shown program last', () => {
  const program = new commander.Command();
  program.option('--global').configureHelp({ showGlobalOptions: true });
  const sub1 = program.command('sub1').option('--sub1');
  const sub2 = sub1.command('sub2');
  expect(sub2.helpInformation()).toContain(`Global Options:
  --sub1
  --global
`);
});

test('when showGlobalOptions:true and sortOptions: true then global options sorted', () => {
  const program = new commander.Command();
  program
    .option('-3')
    .option('-4')
    .option('-2')
    .configureHelp({ showGlobalOptions: true, sortOptions: true });
  const sub1 = program.command('sub1').option('-6').option('-1').option('-5');
  const sub2 = sub1.command('sub2');
  expect(sub2.helpInformation()).toContain(`Global Options:
  -1
  -2
  -3
  -4
  -5
  -6
`);
});
