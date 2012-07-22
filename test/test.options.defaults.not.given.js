/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-a, --anchovies', 'Add anchovies?')
  .option('-o, --onions', 'Add onions?')
  .option('-v, --olives', 'Add olives? Sorry we only have black.', 'black')
  .option('-s, --no-sauce', 'Uh… okay')
  .option('-r, --crust <type>', 'What kind of crust would you like?', 'hand-tossed')
  .option('-c, --cheese [type]', 'optionally specify the type of cheese', 'mozzarella');

program.parse(['node', 'test', '--olives'])

program.should.not.have.property('anchovies');
program.should.not.have.property('onions');
program.should.have.property('olives', 'black');
program.should.have.property('sauce', true);
program.should.have.property('crust', 'hand-tossed');
program.should.have.property('cheese', 'mozzarella');

program.options.should.have.property('anchovies', false);
program.options.should.have.property('onions', false);
program.options.should.have.property('olives', 'black');
program.options.should.have.property('sauce', true);
program.options.should.have.property('crust', 'hand-tossed');
program.options.should.have.property('cheese', 'mozzarella');
