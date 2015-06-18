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

var procSIGINT = exec(bin + ' service', function (error, stdout, stderr) {
  should.equal(0, procSIGINT.exitCode);
});

setTimeout(function(){
  process.kill(procSIGHUP.pid, 'SIGHUP');
},100);
setTimeout(function(){
  process.kill(procSIGTERM.pid, 'SIGTERM');
},100);
setTimeout(function(){
  process.kill(procSIGINT.pid, 'SIGINT');
},100);
