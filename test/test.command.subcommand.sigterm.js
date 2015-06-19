var spawn = require('child_process').spawn ,
    path = require('path') ,
    should = require('should');

var bin = path.join(__dirname, './fixtures/pm')


var proc = spawn(bin,['service'], {});

setTimeout(function(){
  proc.kill('SIGHUP');
  setTimeout(function(){
    should.equal(true, proc.killed);
  },100);
},100);
