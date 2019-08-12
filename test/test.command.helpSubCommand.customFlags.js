var program = require('../'),
  sinon = require('sinon').sandbox.create(),
  should = require('should');

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

// Test that subcommands inherit the help flags
// but can also override help flags
program
  .helpOption('-i, --ihelp', 'foo foo');

program
  .command('child')
  .option('--gender', 'specific gender of child')
  .action((cmd) => {
    console.log('Childsubcommand...');
  });

program
  .command('family')
  .helpOption('-h, --help')
  .action((cmd) => {
    console.log('Familysubcommand...');
  });

// Test arguments
var expectedCommandHelpInformation = [
  'Usage: test child [options]',
  '',
  'Options:',
  '  --gender     specific gender of child',
  '  -i, --ihelp  foo foo',
  ''
].join('\n');

program.parse(['node', 'test', 'child', '-i']);

process.stdout.write.called.should.equal(true);

var output = process.stdout.write.args[0];
output[0].should.equal(expectedCommandHelpInformation);

// Test other command
sinon.restore();

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

var expectedFamilyCommandHelpInformation = [
  'Usage: test family [options]',
  '',
  'Options:',
  '  -h, --help  foo foo',
  ''
].join('\n');

program.parse(['node', 'test', 'family', '-h']);

process.stdout.write.called.should.equal(true);

var output2 = process.stdout.write.args[0];
output2[0].should.equal(expectedFamilyCommandHelpInformation);

sinon.restore();
