var spawn = require('child_process').spawn,
  path = require('path'),
  should = require('should');

var bin = path.join(__dirname, './fixtures/pm');
var proc = spawn(bin, ['listen'], {});

var output = '';
proc.stdout.on('data', function (data) {
  output += data.toString();
});

// Set a timeout to give 'proc' time to setup completely
setTimeout(function () {
  proc.kill('SIGHUP');

  // Set another timeout to give 'prog' time to handle the signal
  setTimeout(function() {
    output.should.equal('SIGHUP\n');
  }, 1000);

}, 2000);