const commander = require('../');

test('when helpOption has custom flags then custom flag invokes help', () => {
  // Optional. Suppress normal output to keep test output clean.
  const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  const program = new commander.Command();
  program
    ._exitOverride()
    .helpOption('--custom-help', 'custom help output');
  expect(() => {
    program.parse(['node', 'test', '--custom-help']);
  }).toThrow('(outputHelp)');
  writeSpy.mockClear();
});

test('when helpOption has custom description then helpInformation include custom description', () => {
  const program = new commander.Command();
  program
    .helpOption('-C,--custom-help', 'custom help output');
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch(/-C,--custom-help +custom help output/);
});
