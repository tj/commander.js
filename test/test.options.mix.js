/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('--foo', 'bar')
  .option('--verbose', 'do stuff')
  .command('setup')
  .description('run setup commands for all envs')
  .action(function () {
    throw new Error('Action should not be exist');
  });
