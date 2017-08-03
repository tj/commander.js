var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .description('sdfdsfsfsdfdsf')
  .option('-n, --name', 'confliced option')
  .option('-n, --toString', 'confliced option')
  .option('-n, --once', 'confliced option')
  .option('-f, --foo', 'add some foo')
  .option('-b, --bar', 'add some bar')
  .option('-M, --no-magic', 'disable magic')
  .option('-c, --camel-case', 'convert to camelCase')
  .option('-q, --quux <quux>', 'add some quux');

program.parse(['node', 'test', '--name', '--toString', '--once', '--foo', '--bar', '--no-magic', '--camel-case', '--quux', 'value']);
program.opts.should.be.a.Function;

var opts = program.opts();
opts.version.should.equal('0.0.1');
opts.name.should.be.true;
opts.toString.should.be.true;
opts.once.should.be.true;
opts.foo.should.be.true;
opts.bar.should.be.true;
opts.magic.should.be.false;
opts.camelCase.should.be.true;
opts.quux.should.equal('value');
