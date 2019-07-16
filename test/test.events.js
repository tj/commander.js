var commander = require('../')
  , should = require('should');

var program = new commander.Command();

program
  .version('0.0.1')
  .option('-T, --no-tests', 'ignore test hook')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf');

var eventsCaptured = [];

function configureEvents(p, prefix) {
  p.on('before:command', function() {
    eventsCaptured.push([prefix, 'before:command', Array.prototype.slice.call(arguments)]);
  });
  p.on('before:option', function() {
    eventsCaptured.push([prefix, 'before:option', Array.prototype.slice.call(arguments)]);
  });
  p.on('command:setup', function() {
    eventsCaptured.push([prefix, 'command:setup', Array.prototype.slice.call(arguments)]);
  });
  p.on('command:exec', function() {
    eventsCaptured.push([prefix, 'command:exec', Array.prototype.slice.call(arguments)]);
  });
  p.on('command:ex', function() {
    eventsCaptured.push([prefix, 'command:ex', Array.prototype.slice.call(arguments)]);
  });
  p.on('command:*', function() {
    eventsCaptured.push([prefix, 'command:*', Array.prototype.slice.call(arguments)]);
  });
  // Don't capture option config for initial tests.
  p.on('option:host', function() {
    eventsCaptured.push([prefix, 'option:host', Array.prototype.slice.call(arguments)]);
  });
  p.on('option:exec_mode', function() {
    eventsCaptured.push([prefix, 'option:exec_mode', Array.prototype.slice.call(arguments)]);
  });
  p.on('option:no-tests', function() {
    eventsCaptured.push([prefix, 'option:no-tests', Array.prototype.slice.call(arguments)]);
  });
}


var setup = program
  .command('setup [env]')
  .option("-o, --host [host]", "Host to use")
  .action(function (env, options) {
  });

var exec = program
  .command('exec <cmd>')
  .alias('ex')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function (cmd, options) {
  });

var unknown = program
  .command('*')
  .action(function () {
  });


configureEvents(program, 'top');
configureEvents(setup, 'setup');
configureEvents(unknown, 'unknown');
configureEvents(exec, 'exec');

eventsCaptured = [];
program.parse(['node', 'test', '--config', 'conf']);
eventsCaptured.should.deepEqual([['top', 'before:option', ['config', 'conf']]]);

eventsCaptured = [];
program.parse(['node', 'test', '--config', 'conf', 'doesnotexist']);
eventsCaptured.should.deepEqual([
  ['top', 'before:option', ['config', 'conf']],
  ['top', 'before:command', ['*', ['doesnotexist', unknown]]],
  ['top', 'command:*', [['doesnotexist', unknown]]]
]);

eventsCaptured = [];
program.parse(['node', 'test', '--config', 'conf1', 'setup', 'env1']);
eventsCaptured.should.deepEqual([
  ['top', 'before:option', ['config', 'conf1']],
  ['top', 'before:command', ['setup', ['env1', setup], []]],
  ['top', 'command:setup', [['env1', setup], []]]
]);

eventsCaptured = [];
program.parse(['node', 'test', '--config', 'conf2', 'setup', '-o', 'host1', 'env2']);
eventsCaptured.should.deepEqual([
  ['top', 'before:option', ['config', 'conf2']],
  ['top', 'before:command', ['setup', ['env2', setup], ['-o', 'host1']]],
  ['setup', 'before:option', ['host', 'host1']],
  ['setup', 'option:host', ['host1']],
  ['top', 'command:setup', [['env2', setup], ['-o', 'host1']]]
]);

program.on('option:config', function() {
  eventsCaptured.push(['top', 'option:config', Array.prototype.slice.call(arguments)]);
})

// Top level options always parsed before commands even when placed later.
eventsCaptured = [];
program.parse(['node', 'test', 'exec', '--config', 'conf4', '--exec_mode', 'mode1', 'exec1']);
eventsCaptured.should.deepEqual([
  ['top', 'before:option', ['config', 'conf4']],
  ['top', 'option:config', ['conf4']],
  ['top', 'before:command', ['exec', ['exec1', exec], ['--exec_mode', 'mode1']]],
  ['exec', 'before:option', ['exec_mode', 'mode1']],
  ['exec', 'option:exec_mode', ['mode1']],
  ['top', 'command:exec', [['exec1', exec], ['--exec_mode', 'mode1']]]
]);

// Handle aliases.
eventsCaptured = [];
program.parse(['node', 'test', '--config', 'conf5', 'ex', '-e', 'mode2', 'exec2']);
eventsCaptured.should.deepEqual([
  ['top', 'before:option', ['config', 'conf5']],
  ['top', 'option:config', ['conf5']],
  ['top', 'before:command', ['ex', ['exec2', exec], ['-e', 'mode2']]],
  ['exec', 'before:option', ['exec_mode', 'mode2']],
  ['exec', 'option:exec_mode', ['mode2']],
  ['top', 'command:ex', [['exec2', exec], ['-e', 'mode2']]]
]);
