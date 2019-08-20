var program = require('../');
var should  = require('should');
var result;
var commander;

function createCommanderInstanceAndReset() {
  result = null;
  var root = new program.Command();

  var cmd = root
    .command('cmd')
    .option('-q, --quiet')
    .forwardSubcommands();

  cmd
    .command('sub1')
    .option('-p, --purge')
    .action(function () {});
  var sub = cmd
    .command('sub2')
    .option('-f, --force')
    .forwardSubcommands();

  sub
    .command('subsub')
    .option('-a, --alternative')
    .action(function (commanderInstance) {
      result = commanderInstance.collectAllOptions();
    });

  return root;
}

// ACTION TESTS

commander = createCommanderInstanceAndReset()
commander.parse(['node', 'test', 'cmd', '-q', 'sub2', '-f', 'subsub', '-a']);
should.deepEqual(result, {
  quiet: true,
  force: true,
  alternative: true,
});

commander = createCommanderInstanceAndReset()
commander.parse(['node', 'test', 'cmd', '-q', 'sub2', 'subsub']);
should.deepEqual(result, {
  quiet: true,
  force: undefined,
  alternative: undefined,
});
