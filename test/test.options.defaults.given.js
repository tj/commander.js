/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-a, --anchovies', 'Add anchovies?')
  .option('-o, --onions', 'Add onions?')
  .option('-O, --no-onions', 'No onions')
  .option('-t, --tomatoes', 'Add tomatoes?', false)
  .option('-T, --no-tomatoes', 'No tomatoes')
  .option('-v, --olives', 'Add olives? Sorry we only have black.', 'black')
  .option('-s, --no-sauce', 'Uh… okay')
  .option('-r, --crust <type>', 'What kind of crust would you like?', 'hand-tossed')
  .option('-c, --cheese [type]', 'optionally specify the type of cheese', 'mozzarella');

program.parse(['node', 'test', '--anchovies', '--onions', '--tomatoes', '--olives', '--no-sauce', '--crust', 'thin', '--cheese', 'wensleydale']);
program.should.have.property('anchovies', true);
program.should.have.property('onions', true);
program.should.have.property('tomatoes', true);
program.should.have.property('olives', 'black');
program.should.have.property('sauce', false);
program.should.have.property('crust', 'thin');
program.should.have.property('cheese', 'wensleydale');
