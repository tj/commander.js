var exec = require('child_process').exec
  , path = require('path')
  , should = require('should');

var bin = path.join(__dirname, './fixtures/pm')

var proc = exec(bin + ' service', function (error, stdout, stderr) {
  
});

setTimeout(function(){
  process.kill(proc.pid, 'SIGINT');
  setTimeout(function(){
    should.equal(0, proc.exitCode);
  },100);
},100);
