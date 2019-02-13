var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');

program
  .command('clone <url>')
  .option('--debug-level <level>', 'debug level')
  .complete({
    options: {
      '--debug-level': ['info', 'error'],
    },
    arguments: {
      url: ['https://github.com/1', 'https://github.com/2']
    }
  });

program
  .command('add <file1> <file2>')
  .option('-A', 'add all files')
  .option('--debug-level <level>', 'debug level')
  .complete({
    options: {
      '--debug-level': ['info', 'error'],
    },
    arguments: {
      file1: ['file1.c', 'file11.c'],
      file2: ['file2.c', 'file21.c']
    }
  });

program.hasCompletionRules().should.be.true();

var rootReply = sinon.spy();

program.autocompleteHandleEvent({
  reply: rootReply,
  fragment: 1,
  line: "git",
});

rootReply.calledOnce.should.be.true();
rootReply.getCall(0).args[0].should.deepEqual([
  'clone',
  'add',
  '--help'
]);

var cloneReply = sinon.spy();

program.autocompleteHandleEvent({
  reply: cloneReply,
  fragment: 2,
  line: "git clone",
});

cloneReply.calledOnce.should.be.true();
cloneReply.getCall(0).args[0].should.deepEqual([
  '--debug-level',
  'https://github.com/1',
  'https://github.com/2'
]);

var cloneWithOptionReply = sinon.spy();

program.autocompleteHandleEvent({
  reply: cloneWithOptionReply,
  fragment: 3,
  line: "git clone --debug-level",
});

cloneWithOptionReply.calledOnce.should.be.true();
cloneWithOptionReply.getCall(0).args[0].should.deepEqual([
  'info',
  'error'
]);

var addReply = sinon.spy();

program.autocompleteHandleEvent({
  reply: addReply,
  fragment: 2,
  line: "git add",
});

addReply.calledOnce.should.be.true();
addReply.getCall(0).args[0].should.deepEqual([
  '-A',
  '--debug-level',
  'file1.c',
  'file11.c'
]);

var addWithArgReply = sinon.spy();

program.autocompleteHandleEvent({
  reply: addWithArgReply,
  fragment: 3,
  line: "git add file1.c",
});

addWithArgReply.calledOnce.should.be.true();
addWithArgReply.getCall(0).args[0].should.deepEqual([
  '-A',
  '--debug-level',
  'file2.c',
  'file21.c',
]);
