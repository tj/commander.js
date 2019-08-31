// Example test, fairly direct port from original

var program = require('../');

test('option set on command', () => {
  // (Somewhat odd test converted directly from original.)
  var val = false;
  program
    .command('info [options]')
    .option('-C, --no-color', 'turn off color output')
    .action(function() {
      val = this.color;
    });

  program.parse(['node', 'test', 'info']);

  expect(program.commands[0].color).toBe(val);
});
