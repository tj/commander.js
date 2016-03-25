/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-a, --anchovies', 'Add anchovies?')
  .option('-o, --onions', 'Add onions?', true)
  .option('-v, --olives', 'Add olives? Sorry we only have black.', 'black')
  .option('-s, --no-sauce', 'Uh… okay')
  .option('-r, --crust <type>', 'What kind of crust would you like?', 'hand-tossed')
  .option('-c, --cheese [type]', 'optionally specify the type of cheese', 'mozzarella');

program.should.have.property('_name', '');

program.parse(['node', 'test']);
program.should.have.property('_name', 'test');
program._data.should.not.have.property('anchovies');
program._data.should.not.have.property('onions');
program._data.should.not.have.property('olives');
program._data.should.have.property('sauce', true);
program._data.should.have.property('crust', 'hand-tossed');
program._data.should.have.property('cheese', 'mozzarella');
