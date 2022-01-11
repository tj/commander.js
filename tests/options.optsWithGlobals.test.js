const commander = require('../');

test('when variety of options used with program then opts is same as optsWithGlobals', () => {
  const program = new commander.Command();
  program
    .option('-b, --boolean')
    .option('-r, --require-value <value)')
    .option('-f, --float <value>', 'description', parseFloat)
    .option('-d, --default-value <value)', 'description', 'default value')
    .option('-n, --no-something');

  program.parse(['-b', '-r', 'req', '-f', '1e2'], { from: 'user' });
  expect(program.opts()).toEqual(program.optsWithGlobals());
});

test('when options in sub and program then optsWithGlobals includes both', () => {
  const program = new commander.Command();
  let mergedOptions;
  program
    .option('-g, --global <value>');
  program
    .command('sub')
    .option('-l, --local <value)')
    .action((options, cmd) => {
      mergedOptions = cmd.optsWithGlobals();
    });

  program.parse(['-g', 'GGG', 'sub', '-l', 'LLL'], { from: 'user' });
  expect(mergedOptions).toEqual({ global: 'GGG', local: 'LLL' });
});

test('when options in sub and subsub then optsWithGlobals includes both', () => {
  const program = new commander.Command();
  let mergedOptions;
  program
    .command('sub')
    .option('-g, --global <value)')
    .command('subsub')
    .option('-l, --local <value)')
    .action((options, cmd) => {
      mergedOptions = cmd.optsWithGlobals();
    });

  program.parse(['sub', '-g', 'GGG', 'subsub', '-l', 'LLL'], { from: 'user' });
  expect(mergedOptions).toEqual({ global: 'GGG', local: 'LLL' });
});

test('when same named option in sub and program then optsWithGlobals includes global', () => {
  const program = new commander.Command();
  let mergedOptions;
  program
    .option('-c, --common <value>')
    .enablePositionalOptions();
  program
    .command('sub')
    .option('-c, --common <value)')
    .action((options, cmd) => {
      mergedOptions = cmd.optsWithGlobals();
    });

  program.parse(['-c', 'GGG', 'sub', '-c', 'LLL'], { from: 'user' });
  expect(mergedOptions).toEqual({ common: 'GGG' });
});
