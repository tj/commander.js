var program = require('../')
  , should = require('should');

program.command('foo');

// empty current execArgv
process.execArgv = [];
// in order to run this test properly, COMMANDER_NODE_OPTIONS Environment Variable have to be not defined.

program.getExecutableArguments().should.deepEqual([]);

// lets add some execution arguments to execArgv
process.execArgv = ["--harmony"];
// it should be equal to process.execArgv because of our COMMANDER_NODE_OPTIONS haven't been set yet.
program.getExecutableArguments().should.deepEqual(["--harmony"]);

// set COMMANDER_NODE_OPTIONS environment variable
process.env["COMMANDER_NODE_OPTIONS"] = "--max-old-space-size=8192";
// it should be equal to execArgv and COMMANDER_NODE_OPTIONS combined.
program.getExecutableArguments().should.deepEqual(["--harmony", "--max-old-space-size=8192"]);