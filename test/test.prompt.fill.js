/**
 * Module dependencies.
 */

var events = require('events')
  , should = require('should')
  , Command = require('../').Command;

//mock stdin on process
var stdin = new events.EventEmitter();
stdin.setEncoding = stdin.pause = stdin.resume = function() {};
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

var name_prompt = 'What is your name? '
  , age_prompt = 'How old are your? '
  , name_input_on_command = 'name input on command'
  , age_input_on_command = 'age input on command'
  , name_input_from_prompt = 'name input from prompt'
  , age_input_from_prompt = 'age input from prompt'
  , prompt_config = {
    'nickname': name_prompt
    , 'age': age_prompt
  };


/**
 * Test case that --nickname and --age aren't supplied on command line.
 */
program = new Command()
  .option('-n, --nickname <name>')
  .option('-a, --age <age>')
  .parse(['node', 'test']);

stdout.expect(name_prompt, function() {
  program.fill(prompt_config);

  stdout.expect(age_prompt, function() {
    stdin.write(name_input_from_prompt);
  });

  stdin.write(age_input_from_prompt);
})

program.on('filled', function(program) {
  program.should.have.property('nickname', name_input_from_prompt);
  program.should.have.property('age', age_input_from_prompt);
});


/**
 * Test case that --nickname is supplied on command line, but --age.
 */
program = new Command()
  .option('-n, --nickname <name>')
  .option('-a, --age <age>')
  .parse(['node', 'test', '--nickname', name_input_on_command]);

stdout.expect(age_prompt, function() {
  program.fill(prompt_config);
  stdin.write(age_input_from_prompt);
})

program.on('filled', function(program) {
  program.should.have.property('nickname', name_input_on_command);
  program.should.have.property('age', age_input_from_prompt);
});


/**
 * Test case that --age is supplied on command line, but --nickname.
 */
program = new Command()
  .option('-n, --nickname <name>')
  .option('-a, --age <age>')
  .parse(['node', 'test', '--age', age_input_on_command]);

stdout.expect(name_prompt, function() {
  program.fill(prompt_config);
  stdin.write(name_input_from_prompt);
})

program.on('filled', function(program) {
  program.should.have.property('nickname', name_input_from_prompt);
  program.should.have.property('age', age_input_on_command);
});


/**
 * Test case that --nickname and --age are supplied on command line.
 */
program = new Command()
  .option('-n, --nickname <name>')
  .option('-a, --age <age>')
  .parse(['node', 'test', '--nickname', name_input_on_command, '--age', age_input_on_command]);

program.fill(prompt_config);

program.on('filled', function(program) {
  program.should.have.property('nickname', name_input_on_command);
  program.should.have.property('age', age_input_on_command);
});
