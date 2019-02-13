var program = require('../')
  , should = require('should');

program.hasCompletionRules().should.be.false();

program
  .arguments('<filename>')
  .option('--verbose', 'verbose')
  .option('-o, --output <file>', 'output')
  .option('--debug-level <level>', 'debug level')
  .option('-m <mode>', 'mode')
  .complete({
    options: {
      '--output': function() { return ['file1', 'file2'] },
      '--debug-level': ['info', 'error'],
      '-m': function(typedArgs) { return typedArgs; }
    },
    arguments: {
      filename: ['file1.c', 'file2.c']
    }
  });

program.hasCompletionRules().should.be.true();

program.autocompleteNormalizeRules().should.deepEqual({
  options: {
    '--verbose': {
      arity: 0,
      sibling: null,
      reply: []
    },
    '-o': {
      arity: 1,
      sibling: '--output',
      reply: program._completionRules.options['--output']
    },
    '--output': {
      arity: 1,
      sibling: '-o',
      reply: program._completionRules.options['--output']
    },
    '--debug-level': {
      arity: 1,
      sibling: null,
      reply: ['info', 'error']
    },
    '-m': {
      arity: 1,
      sibling: null,
      reply: program._completionRules.options['-m']
    }
  },
  args: [
    ['file1.c', 'file2.c']
  ]
});

program.autocompleteCandidates([]).should.deepEqual([
  '--verbose',
  '-o',
  '--output',
  '--debug-level',
  '-m',
  'file1.c',
  'file2.c'
]);

program.autocompleteCandidates(['--verbose']).should.deepEqual([
  '-o',
  '--output',
  '--debug-level',
  '-m',
  'file1.c',
  'file2.c'
]);

program.autocompleteCandidates(['-o']).should.deepEqual([
  'file1',
  'file2'
]);

program.autocompleteCandidates(['--output']).should.deepEqual([
  'file1',
  'file2'
]);

program.autocompleteCandidates(['--debug-level']).should.deepEqual([
  'info',
  'error'
]);

program.autocompleteCandidates(['-m']).should.deepEqual([
  '-m'
]);

program.autocompleteCandidates(['--verbose', '-m']).should.deepEqual([
  '--verbose',
  '-m'
]);

program.autocompleteCandidates([
  '--verbose',
  '-o', 'file1',
  '--debug-level', 'info',
  '-m', 'production'
]).should.deepEqual([
  'file1.c',
  'file2.c'
]);

// nothing to complete
program.autocompleteCandidates([
  '--verbose',
  '-o', 'file1',
  '--debug-level', 'info',
  '-m', 'production',
  'file1.c'
]).should.deepEqual([]);

// place arguments in different position
program.autocompleteCandidates([
  'file1.c',
  '-o', 'file1',
  '--debug-level', 'info',
  '-m', 'production'
]).should.deepEqual([
  '--verbose'
]);

// should handle the case
// when provide more args than expected
program.autocompleteCandidates([
  'file1.c',
  'file2.c',
  '--verbose',
  '-o', 'file1',
  '--debug-level', 'info',
  '-m', 'production'
]).should.deepEqual([]);
