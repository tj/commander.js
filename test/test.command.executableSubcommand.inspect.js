const exec = require('child_process').exec;
const path = require('path');
const should = require('should');

var inspectCommand = path.join(__dirname, 'fixtures', 'inspect.js');

exec(`node ${inspectCommand} sub`, function(_error, stdout, stderr) {
  stdout.should.equal('[]\n');
});

exec(`node --harmony ${inspectCommand} sub`, function(_error, stdout, stderr) {
  stdout.should.equal("[ '--harmony' ]\n");
});

// Skip tests for node 6 when --inspect was only prototype
if (process.version.substr(1).split('.')[0] === '6') {
  console.log('Skipping --inspect tests for node 6');
} else {
  // Test that inspector port gets incremented.
  // If we reuse port we can get conflicts because port not released fast enough.

  // --inspect defaults to 127.0.0.1:9229, port should be incremented
  exec(`node --inspect ${inspectCommand} sub`, function(_error, stdout, stderr) {
    stdout.should.equal("[ '--inspect=127.0.0.1:9230' ]\n");
  });

  // custom port
  exec(`node --inspect=9240 ${inspectCommand} sub`, function(_error, stdout, stderr) {
    stdout.should.equal("[ '--inspect=127.0.0.1:9241' ]\n");
  });
  // zero is special, random port
  exec(`node --inspect=0 ${inspectCommand} sub`, function(_error, stdout, stderr) {
    stdout.should.equal("[ '--inspect=0' ]\n");
  });

  // ip address
  exec(`node --inspect=127.0.0.1:9250 ${inspectCommand} sub`, function(_error, stdout, stderr) {
    stdout.should.equal("[ '--inspect=127.0.0.1:9251' ]\n");
  });

  // localhost
  exec(`node --inspect=localhost:9260 ${inspectCommand} sub`, function(_error, stdout, stderr) {
    stdout.should.equal("[ '--inspect=localhost:9261' ]\n");
  });

  // --inspect-port, just test most likely format
  exec(`node --inspect-port=9270 ${inspectCommand} sub`, function(_error, stdout, stderr) {
    stdout.should.equal("[ '--inspect-port=127.0.0.1:9271' ]\n");
  });
}
