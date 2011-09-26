/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-p, --anchovies', 'Add anchovies?')
  .option('-p, --onions', 'Add onions?', true)
  .option('-r, --olives', 'Add olives? Sorry we only have black.', 'black')
  .option('-p, --no-sauce', 'Uh… okay')
  .option('-r, --crust <type>', 'What kind of crust would you like?', 'hand-tossed')
  .option('-c, --cheese [type]', 'optionally specify the type of cheese', 'mozzarella');

program.parse(['node', 'test']);
program.should.not.have.property('anchovies');
program.should.not.have.property('onions');
program.should.not.have.property('olives');
program.should.have.property('sauce', true);
program.should.have.property('crust', 'hand-tossed');
program.should.have.property('cheese', 'mozzarella');
