// const { Command, Option } = require('commander'); // (normal include)
const { Command, Option, InvalidArgumentError } = require('../'); // include commander in git clone of commander repo

// This program produces all the translated strings for a locale.

function run(args, usage) {
  console.log(usage ?? `$ program ${args.join(' ')}`);
  try {
    program.parse(args, { from: 'user' });
  } catch (e) {
  }
  console.log('\n-----\n');
}

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('My error message.');
  }
  return parsedValue;
}

const locale = process.argv[2];
if (!locale) {
  console.log('Error: missing argument. Please specify a target locale to test.');
  console.log('\nFor example:');
  console.log('   node translations zh-CN');
  process.exit(2);
}

const program = new Command();
program
  .locale(locale)
  .exitOverride()
  .allowExcessArguments(false);

// program with help command AND subcommands AND action handler to generate various messages!
program
  .version('0.1.2')
  .addHelpCommand(true)
  .argument('<my-arg>', 'my-description')
  .option('-d <my-value>', 'my default', 'foo')
  .addOption(new Option('-e <my-value>', 'my environment variable').env('FOO'))
  .addOption(new Option('-c <my-value>', 'my choices').choices(['foo', 'bar']))
  .addOption(new Option('-p [my-value]', 'my preset').preset('bar'))
  .action(() => {});

program.command('print')
  .description('my print')
  .argument('<my-filename>', 'my file');

program.command('ssh')
  .requiredOption('--password');

program.command('answer')
  .option('--yes')
  .addOption(new Option('--no').conflicts('yes'));

program.command('serve')
  .allowExcessArguments(false)
  .argument('[my-port]', 'my description', myParseInt)
  .addOption(new Option('--port <my-value>', 'my number').argParser(myParseInt).env('PORT'))
  .action((options) => {
    console.log(options);
  });

const animalCmd = program.command('animal');
animalCmd.command('rat');
animalCmd.command('cat');

run(['--help']);

// commander.missingArgument
run(['print']);

// commander.optionMissingArgument
run(['-d']);

// commander.missingMandatoryOptionValue
run(['ssh']);

// commander.conflictingOption
run(['answer', '--yes', '--no']);

// commander.unknownOption
run(['--unknown']);

// commander.unknownCommand
run(['animal', 'unknown']);
// suggest similar
run(['animal', 'bat']);
run(['animal', 'rats']);


// commander.invalidArgument
run(['serve', '--port', 'NaN']);
run(['serve', 'NaN']);
run(['-c', 'foobar']);

process.env.PORT = 'nan';
run(['serve'], '$ PORT=nan program server');
delete process.env.PORT;

// commander.excessArguments
run(['1', '2', '3']);
run(['serve', '1', '2', '3']);

// Try the following:
//    node translations.js en
//    node translations.js zh-CN
