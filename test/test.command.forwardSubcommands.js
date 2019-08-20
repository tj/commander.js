var program = require('../');
var should  = require('should');
var result;
var commander;

function resetResult() {
  result = {
    count: 0,
    last: '',
    param: undefined,
  };
}

function touchCommand(cmd, param) {
  result.count++;
  result.last = cmd;
  result.param = param;
}

function assertResult(cmd, param) {
  should.equal(result.last, cmd);
  should.equal(result.count, 1);
  if (param) should.equal(result.param, param);
}

function createCommanderInstanceAndReset() {
  resetResult();
  var root = new program.Command();

  root
    .command('cmd1')
    .action(function () { touchCommand('command1') });

  var cmd2 = root
    .command('cmd2')
    .option('-q, --quiet')
    .forwardSubcommands();
  cmd2
    .command('sub21')
    .option('-f, --force')
    .action(function (cmdInstance) { touchCommand('subcommand21', cmdInstance) });
  cmd2
    .command('sub22 <param>')
    .action(function (param) { touchCommand('subcommand22', param) });

  var cmd3 = root
    .command('cmd3')
    .forwardSubcommands();
  cmd3
    .command('sub31')
    .action(function () { touchCommand('subcommand31') });

  return root;
}

// ACTION TESTS

commander = createCommanderInstanceAndReset()
commander.parse(['node', 'test', 'cmd1']);
assertResult('command1');

commander = createCommanderInstanceAndReset()
commander.parse(['node', 'test', 'cmd2', 'sub21']);
assertResult('subcommand21');

commander = createCommanderInstanceAndReset()
commander.parse(['node', 'test', 'cmd2', 'sub22', 'theparam']);
assertResult('subcommand22', 'theparam');

commander = createCommanderInstanceAndReset()
commander.parse(['node', 'test', 'cmd3', 'sub31']);
assertResult('subcommand31');

// OPTION TESTS

commander = createCommanderInstanceAndReset()
commander.parse(['node', 'test', 'cmd2', 'sub21', '-f']);
Boolean(result.param.force).should.be.true();

commander = createCommanderInstanceAndReset()
commander.parse(['node', 'test', 'cmd2', '-q', 'sub21']);
Boolean(result.param.parent.quiet).should.be.true();

// Keeping as an example but this may be incorrect
// -q is a parameter to the first command layer
// so potentially it must be ignored if specified after second level
commander = createCommanderInstanceAndReset()
commander.parse(['node', 'test', 'cmd2', 'sub21', '-q']);
Boolean(result.param.parent.quiet).should.be.true();
