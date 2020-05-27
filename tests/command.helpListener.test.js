const commander = require('../');

jest.spyOn(global.console, 'log').mockImplementation();

// Testing help listeners, both "local" and global

// Avoid doing many full format tests as will be broken by any layout changes!
test('when listening for the help:body the default help command should be overriden', () => {
  const program = new commander.Command();
  program
    .on('help:body', (instance) => {
      console.log(`------------
${instance.helpInformation().replace(/\n$/, '\n------------\n')}`);
    })
    .command('my-command <file>');
  const expectedHelpInformation =
`------------
Usage: test [options] [command]

Options:
  -h, --help         display help for command

Commands:
  my-command <file>
  help [command]     display help for command
------------
`;

  program.name('test');
  program.outputHelp();
  expect(global.console.log).toHaveBeenCalledWith(expectedHelpInformation);
});

test('when listening for the help:header the listener should be called correctly', () => {
  const program = new commander.Command();
  const listenerCall = jest.fn();
  program
    .on('help:header', listenerCall)
    .on('help:body', () => {}) // to prevent printing to console
    .command('my-command <file>');

  program.outputHelp();
  expect(listenerCall).toHaveBeenCalledTimes(1);
});

test('when listening for the help:footer the listener should be called correctly', () => {
  const program = new commander.Command();
  const listenerCall = jest.fn();
  program
    .on('help:footer', listenerCall)
    .on('help:body', () => {}) // to prevent printing to console
    .command('my-command <file>');

  program.outputHelp();
  expect(listenerCall).toHaveBeenCalledTimes(1);
});

test('when listening for help:header, help:body and help:footer they should be called in the correct order', () => {
  const program = new commander.Command();
  const callOrder = [];
  program
    .on('help:footer', () => {
      callOrder.push('help:footer');
    })
    .on('help:header', () => {
      callOrder.push('help:header');
    })
    .on('help:body', () => {
      callOrder.push('help:body');
    })
    .command('my-command <file>');

  program.outputHelp();
  expect(callOrder[0]).toBe('help:header');
  expect(callOrder[1]).toBe('help:body');
  expect(callOrder[2]).toBe('help:footer');
});
