/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook')

var envValue = "";
var cmdValue = "";
var customHelp = false;

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .option("-o, --host [host]", "Host to use")
  .action(function(env, options){
    var mode = options.setup_mode || "normal";
    env = env || 'all';
    
    envValue = env;
  });

program
  .command('exec <cmd>')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .option("-t, --target [target]", "Target to use")
  .action(function(cmd, options){
    cmdValue = cmd;
  }).on("--help", function(){
    customHelp = true;
  });

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });
  
program.parse(['node', 'test', '--config', 'conf']);
program.config.should.equal("conf");
program.commands[0].should.not.have.property.setup_mode;
program.commands[1].should.not.have.property.exec_mode;
envValue.should.be.null;
cmdValue.should.be.null;

program.parse(['node', 'test', '--config', 'conf1', 'setup', '--setup_mode', 'mode3', 'env1']);
program.config.should.equal("conf1");
program.commands[0].setup_mode.should.equal("mode3");
program.commands[0].should.not.have.property.host;
envValue.should.equal("env1");

program.parse(['node', 'test', '--config', 'conf2', 'setup', '--setup_mode', 'mode3', '-o', 'host1', 'env2']);
program.config.should.equal("conf2");
program.commands[0].setup_mode.should.equal("mode3");
program.commands[0].host.should.equal("host1");
envValue.should.equal("env2");

program.parse(['node', 'test', '--config', 'conf3', 'setup', '-s', 'mode4', 'env3']);
program.config.should.equal("conf3");
program.commands[0].setup_mode.should.equal("mode4");
envValue.should.equal("env3");

program.parse(['node', 'test', '--config', 'conf4', 'exec', '--exec_mode', 'mode1', 'exec1']);
program.config.should.equal("conf4");
program.commands[1].exec_mode.should.equal("mode1");
program.commands[1].should.not.have.property.target;
cmdValue.should.equal("exec1");

program.parse(['node', 'test', '--config', 'conf5', 'exec', '-e', 'mode2', 'exec2']);
program.config.should.equal("conf5");
program.commands[1].exec_mode.should.equal("mode2");
cmdValue.should.equal("exec2");

program.parse(['node', 'test', '--config', 'conf6', 'exec', '--target', 'target1', '-e', 'mode2', 'exec3']);
program.config.should.equal("conf6");
program.commands[1].exec_mode.should.equal("mode2");
program.commands[1].target.should.equal("target1");
cmdValue.should.equal("exec3");

// Make sure we still catch errors with required values for options
var exceptionOccurred = false;
var oldProcessExit = process.exit;
var oldConsoleError = console.error;
process.exit = function() { exceptionOccurred = true; throw new Error(); };
console.error = function() {};

try {
  program.parse(['node', 'test', '--config', 'conf6', 'exec', '--help']);
} catch(ex) {
  program.config.should.equal("conf6");
}

try {
    program.parse(['node', 'test', '--config', 'conf', 'exec', '-t', 'target1', 'exec1', '-e']);
}
catch(ex) {
}

process.exit = oldProcessExit;
exceptionOccurred.should.be.true;
customHelp.should.be.true;
