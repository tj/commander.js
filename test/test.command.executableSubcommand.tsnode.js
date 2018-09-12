var exec = require('child_process').exec
  , path = require('path')
  , should = require('should');

var bin = path.join(__dirname, './fixtures-ts/pm.ts')

// success case
exec(process.argv[0] + ' -r ts-node/register ' + bin + ' install', function (error, stdout, stderr) {
  stdout.should.equal('install\n');
});
