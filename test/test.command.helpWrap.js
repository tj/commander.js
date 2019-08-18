var program = require('../')
  , sinon = require('sinon').createSandbox()
  , should = require('should');

process.stdout.columns = 80;

// test should make sure that the description text of commands and options
// is wrapped at the columns width and indented correctly
program
  .description('description of the command')
  .option('-x -extra-long-option-switch', 'kjsahdkajshkahd kajhsd akhds kashd kajhs dkha dkh aksd ka dkha kdh kasd ka kahs dkh sdkh askdh aksd kashdk ahsd kahs dkha skdh ')
  .option('-s', 'some other shorter description')
  .command('alpha', 'Lorem mollit quis dolor ex do eu quis ad insa a commodo esse.')
  .command('beta-gamma-delta', 'Consectetur tempor eiusmod occaecat veniam veniam Lorem anim reprehenderit ipsum amet.');

var expectedOutput = `Usage:  [options] [command]

description of the command

Options:
  -x -extra-long-option-switch  kjsahdkajshkahd kajhsd akhds kashd kajhs dkha 
                                dkh aksd ka dkha kdh kasd ka kahs dkh sdkh 
                                askdh aksd kashdk ahsd kahs dkha skdh 
  -s                            some other shorter description
  -h, --help                    output usage information

Commands:
  alpha                         Lorem mollit quis dolor ex do eu quis ad insa 
                                a commodo esse.
  beta-gamma-delta              Consectetur tempor eiusmod occaecat veniam 
                                veniam Lorem anim reprehenderit ipsum amet.
`;

program.helpInformation().should.equal(expectedOutput);
