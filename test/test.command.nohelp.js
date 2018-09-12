var program = require('../')
	, sinon = require('sinon').sandbox.create()
  , should = require('should');

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

program.command('mycommand [options]', 'this is my command');

program
	.command('anothercommand [options]')
  .action(function() { return; });

program.command('hiddencommand [options]', 'you won\'t see me', { noHelp: true });

program
	.command('hideagain [options]', null, { noHelp: true })
  .action(function() { return; });

program.command('hiddencommandwithoutdescription [options]', { noHelp: true });

program.parse(['node', 'test']);

program.name.should.be.a.Function();
program.name().should.equal('test');
program.commands[0].name().should.equal('mycommand');
program.commands[0]._noHelp.should.be.false();
program.commands[1].name().should.equal('anothercommand');
program.commands[1]._noHelp.should.be.false();
program.commands[2].name().should.equal('hiddencommand');
program.commands[2]._noHelp.should.be.true();
program.commands[3].name().should.equal('hideagain');
program.commands[3]._noHelp.should.be.true();
program.commands[4].name().should.equal('hiddencommandwithoutdescription');
program.commands[4]._noHelp.should.be.true();
program.commands[5].name().should.equal('help');



sinon.restore();
sinon.stub(process.stdout, 'write');
program.outputHelp();

process.stdout.write.calledOnce.should.be.true();
process.stdout.write.args.length.should.equal(1);

var output = process.stdout.write.args[0];

var expect = [
	'Commands:',
	'',
	'  mycommand [options]       this is my command',
	'  anothercommand [options]',
	'  help [cmd]                display help for [cmd]'
].join('\n');
output[0].indexOf(expect).should.not.be.equal(-1);
