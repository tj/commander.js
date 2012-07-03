/**
 * Module dependencies.
 */

var events = require('events')
 ,  program = require('../')
 ,  should = require('should');

//mock stdin on process
var stdin = new events.EventEmitter();
stdin.setEncoding = stdin.resume = function() {};
stdin.write = function(data) { stdin.emit('data', data); };
process.__defineGetter__('stdin', function() { return stdin });

//mock stdout on process
var stdout = new events.EventEmitter();
stdout.write = function(data) { this.emit('data', data) };
stdout.expect = function(expected, fn) {
  var actual = '';
  this.once('data', function(data){ actual = data; });
  fn();
  actual.should.equal(expected);
}
//var realOut = process.stdout;
process.__defineGetter__('stdout', function() { return stdout });

var count = 0;
var test = function(expected) {
  count++;
  return function(actual) {
    count--;
    if(expected instanceof Date) {
      //need something better :(
      //using `new Date(date.toString())` round trip
      //loosing some precision for .getTime()
      actual.should.be.an.instanceof(Date);
    } else {
      actual.should.equal(expected);
    }
  }
}

process.on('exit', function(){
  count.should.equal(0);
})

/* Single Line String Prompt Tests */
var prompt = 'hello '
 ,  expected = 'world';

// simple single line string 
stdout.expect(prompt, function(){
    program.prompt(prompt, test(expected));
    stdin.write(expected);    
})
// with trim
stdout.expect(prompt, function(){
    program.prompt(prompt, test(expected));
    stdin.write('      ' + expected + '      ');    
})
// newline
stdout.expect(prompt, function(){
    program.prompt(prompt, test(''));
    stdin.write('\n');    
})

/* Multiline Tests*/
var prompt = 'A multiline';
stdout.expect(prompt + '\n', function() {
  program.prompt(prompt, test('hello world\n  and what a world\nit could be'));
  stdin.write('hello world\n');
  stdin.write('  and what a world\n');
  stdin.write('it could be\n');
  stdin.write('\n');
})

/* Date Prompt Tests */
var prompt = 'A date '
 ,  expected = new Date();
 
// simple date
stdout.expect(prompt, function(){
    program.prompt(prompt, Date, test(expected));
    stdin.write(expected.toString());    
})
// not a date twice
stdout.expect(prompt, function() {
  program.prompt(prompt, Date, test(expected));
  
  stdout.expect(prompt + '(must be a date) ', function() {
    stdin.write('blue');    
  })
  stdout.expect(prompt + '(must be a date) ', function() {
    stdin.write('blue');    
  })
  stdin.write(expected.toString());    
})

/* Number Prompt Tests*/
var prompt = 'A number '
 ,  expected = 12;
 
//simple number
stdout.expect(prompt, function(){
    program.prompt(prompt, Number, test(expected));
    stdin.write(expected.toString());    
})

// not a number twice
stdout.expect(prompt, function() {
  program.prompt(prompt, Number, test(expected));
  
  stdout.expect(prompt + '(must be a number) ', function() {
    stdin.write('blue');    
  })
  stdout.expect(prompt + '(must be a number) ', function() {
    stdin.write('blue');    
  })
  stdin.write(expected.toString());    
})

