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
  proc.kill('SIGUSR1');

  // Set another timeout to give 'prog' time to handle the signal
  setTimeout(function() {
    /*
     * As described at https://nodejs.org/api/process.html#process_signal_events
     * this signal will start a debugger and thus the process might output an
     * additional error message: 
     * 
     *    "Failed to open socket on port 5858, waiting 1000 ms before retrying".
     * 
     * Therefore, we are a bit more lax in matching the output.
     * It must contain the expected output, meaning an empty line containing
     * only "SIGUSR1", but any other output is also allowed.
     */
    output.should.match(/(^|\n)SIGUSR1\n/);
  }, 1000);

}, 2000);