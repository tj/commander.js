// converted from test/test.command.action.js
var Command = require('../../').Command
  , test = require('ava');

test('command action', (t) => {
  var val;
  var program = new Command();
  program
    .command('info [options]')
    .option('-C, --no-color', 'turn off color output')
    .action(function () {
      val = this.color;
    });
  program.parse(['node', 'test', 'info', '-C']);
  t.is(program.commands.length, 1);
  t.false(program.commands[0].color);
  t.false(val);
})
