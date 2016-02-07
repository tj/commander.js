var exec = require('child_process').exec
  , path = require('path')
  , should = require('should');



var bin = path.join(__dirname, './fixtures/pm')
// not exist
exec(bin + ' list', function (error, stdout, stderr) {
  //stderr.should.equal('\n  pm-list(1) does not exist, try --help\n\n');
  // TODO error info are not the same in between <=v0.8 and later version
  should.notEqual(0, stderr.length);
});

// success case
exec(bin + ' install', function (error, stdout, stderr) {
  stdout.should.equal('install\n');
});

// subcommand bin file with explicit extension
exec(bin + ' publish', function (error, stdout, stderr) {
  stdout.should.equal('publish\n');
});

// spawn EACCES
exec(bin + ' search', function (error, stdout, stderr) {
  // TODO error info are not the same in between <v0.10 and v0.12
  should.notEqual(0, stderr.length);
});

// subcommand bin file with explicit coffeescript extension
// is executed only if coffee command is available
exec('coffee -v', function (error, stdout, stderr) {
  if (stdout) {
    exec(bin + ' info', function (error, stdout, stderr) {
      stdout.should.equal('info\n');
    });
  } else {
    console.log("\n\nNOTE: test for subcommand bin file with explicit coffeescript\n"+
                "extension was ignored because the coffee command was not found\n");
  }
});

// when `bin` is a symbol link for mocking global install
var symbolBin = path.join(__dirname, './fixtures/pmlink')
// success case
exec(symbolBin + ' install', function (error, stdout, stderr) {
  stdout.should.equal('install\n');
});
