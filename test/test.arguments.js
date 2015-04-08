/**
 * Top-level command syntax.
 */

var program = require('../')
  , should = require('should');

var envValue = "";
var cmdValue = "";

program
  .version('0.0.1')
  .arguments('<cmd> [env]')
  .action(function (cmd, env) {
    cmdValue = cmd;
    envValue = env;
  })
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook');

program.parse(['node', 'test', '--config', 'conf']);
program.config.should.equal("conf");
cmdValue.should.equal("");
envValue.should.equal("");

program.parse(['node', 'test', '--config', 'conf1', 'setup', '--setup_mode', 'mode3', 'env1']);
program.config.should.equal("conf1");
cmdValue.should.equal("setup");
envValue.should.equal("env1");
