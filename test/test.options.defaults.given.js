/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

function increaseVerbosity(v, total) {
  return total + 1;
}

program
  .version('0.0.1')
  .option('-a, --anchovies', 'Add anchovies?')
  .option('-o, --onions', 'Add onions?', true)
  .option('-l, --olives', 'Add olives? Sorry we only have black.', 'black')
  .option('-s, --no-sauce', 'Uh… okay')
  .option('-r, --crust <type>', 'What kind of crust would you like?', 'hand-tossed')
  .option('-c, --cheese [type]', 'optionally specify the type of cheese', 'mozzarella')
  .option('-v, --verbose', 'increase verbosity', increaseVerbosity, 3);

program.parse(['node', 'test', '--anchovies', '--onions', '--olives', '--no-sauce', '--crust', 'thin', '--cheese', 'wensleydale', '-v', '-v']);
program.should.have.property('anchovies', true);
program.should.have.property('onions', true);
program.should.have.property('olives', 'black');
program.should.have.property('sauce', false);
program.should.have.property('crust', 'thin');
program.should.have.property('cheese', 'wensleydale');
program.should.have.property('verbose', 5);
