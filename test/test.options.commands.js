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

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .option("-o, --host [host]", "Host to use")
  .action(function(env, options){
    var mode = options.setup_mode || "normal";
    env = env || 'all';
    
    env.should.equal('env1');
  });

program
  .command('exec <cmd>')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .option("-t, --target [target]", "Target to use")
  .action(function(cmd, options){
    cmd.should.equal('exec1');
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

program.parse(['node', 'test', '--config', 'conf', 'setup', '--setup_mode', 'mode3', 'env1']);
program.config.should.equal("conf");
program.commands[0].setup_mode.should.equal("mode3");
program.commands[0].should.not.have.property.host;

program.parse(['node', 'test', '--config', 'conf', 'setup', '--setup_mode', 'mode3', '-o', 'host1', 'env1']);
program.config.should.equal("conf");
program.commands[0].setup_mode.should.equal("mode3");
program.commands[0].host.should.equal("host1");

program.parse(['node', 'test', '--config', 'conf', 'setup', '-s', 'mode4', 'env1']);
program.config.should.equal("conf");
program.commands[0].setup_mode.should.equal("mode4");

program.parse(['node', 'test', '--config', 'conf', 'exec', '--exec_mode', 'mode1', 'exec1']);
program.config.should.equal("conf");
program.commands[1].exec_mode.should.equal("mode1");
program.commands[1].should.not.have.property.target;

program.parse(['node', 'test', '--config', 'conf', 'exec', '-e', 'mode2', 'exec1']);
program.config.should.equal("conf");
program.commands[1].exec_mode.should.equal("mode2");

program.parse(['node', 'test', '--config', 'conf', 'exec', '--target', 'target1', '-e', 'mode2', 'exec1']);
program.config.should.equal("conf");
program.commands[1].exec_mode.should.equal("mode2");
program.commands[1].target.should.equal("target1");

// Make sure we still catch errors with required values for options
var exceptionOccurred = false;
var oldProcessExit = process.exit;
process.exit = function() { exceptionOccurred = true; throw new Error(); };

try {
    program.parse(['node', 'test', '--config', 'conf', 'exec', '-t', 'target1', 'exec1', '-e']);
}
catch(ex) {
}

exceptionOccurred.should.be.true;

process.exit = oldProcessExit;