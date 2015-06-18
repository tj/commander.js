var exec = require('child_process').exec
  , path = require('path')
  , should = require('should');



var bin = path.join(__dirname, './fixtures/pm')

var procSIGHUP = exec(bin + ' service', function (error, stdout, stderr) {

  should.equal(0, procSIGHUP.exitCode);
});

var procSIGTERM = exec(bin + ' service', function (error, stdout, stderr) {
  should.equal(0, procSIGTERM.exitCode);
});

setTimeout(function(){
  process.kill(procSIGHUP.pid, 'SIGHUP');
  process.kill(procSIGTERM.pid, 'SIGTERM');
},200);
