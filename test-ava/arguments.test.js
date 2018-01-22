// converted from test/test.arguments.js
var Command = require('../').Command
  , test = require('ava');

function createProgram(capture) {
  var program = new Command();
  program
    .version('0.0.1')
    .arguments('<cmd> [env]')
    .action(function (cmd, env) {
      capture.cmdValue = cmd;
      capture.envValue = env;
    })
    .option('-C, --chdir <path>', 'change the working directory')
    .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
    .option('-T, --no-tests', 'ignore test hook');
  return program;
}

test('option', (t) => {
  var capture = {};
  var program = createProgram(capture);
  program.parse(['node', 'test', '--config', 'conf']);
  t.is(program.config, 'conf');
  t.is(capture.cmdValue, undefined);
  t.is(capture.envValue, undefined);
})

test('option and command', (t) => {
  var capture = {};
  var program = createProgram(capture);
  program.parse(['node', 'test', '--config', 'conf1', 'setup', '--setup_mode', 'mode3', 'env1']);
  t.is(program.config, 'conf1');
  t.is(capture.cmdValue, 'setup');
  t.is(capture.envValue, 'env1');
})
