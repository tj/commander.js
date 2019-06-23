var program = require('../')
  , should = require('should');

program
  .option('-c <required>', 'required with adjacent value')
  .option('-q <required>', 'required with separated value')
  .option('-o [optional]', 'optional with adjacent value')
  .option('-p [optional]', 'optional with separated value')
  .option('-n [optional]', 'optional without value in the middle')
  .option('-r [optional]', 'optional without value in the end');

program.parse(['node', 'test', '-c22', '-q', '33', '-o44', '-n', '-p', '55', '-r']);
program.C.should.equal('22');
program.Q.should.equal('33');
program.O.should.equal('44');
program.N.should.equal(true);
program.P.should.equal('55');
program.R.should.equal(true);
