var program = require('../')
  , util = require('util')
  , exec = require('child_process').exec
  , path = require('path')
  , should = require('should');



var bin = path.join(__dirname, './fixtures/pm')
// not exist
exec(bin + ' list', function (error, stdout, stderr) {
  stderr.should.equal('\n  pm-list(1) does not exist, try --help\n\n');
});

// success case
exec(bin + ' install', function (error, stdout, stderr) {
  stdout.should.equal('install\n');
});

// spawn EACCES
exec(bin + ' search', function (error, stdout, stderr) {
  should.notEqual(-1, stderr.indexOf('spawn EACCES'));
});
