var exec = require('child_process').exec
  , path = require('path')
  , should = require('should');



var bin = path.join(__dirname, './fixtures/pm')
// success case
exec(bin + ' default', function(error, stdout, stderr) {
  stdout.should.equal('default\n');
});

// success case (default)
exec(bin, function(error, stdout, stderr) {
  stdout.should.equal('default\n');
});

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

// when `bin` is a symbol link for mocking global install
var bin = path.join(__dirname, './fixtures/pmlink')
// success case
exec(bin + ' install', function (error, stdout, stderr) {
  stdout.should.equal('install\n');
});
