// const { Command, Option } = require('commander'); // (normal include)
const { Command, Option, InvalidArgumentError } = require('../'); // include commander in git clone of commander repo

// This program produces all the translated strings for a locale.

function makeProgram(locale) {
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
    .addOption(new Option('--right').env('RIGHT'))
    .addOption(new Option('--wrong').conflicts('right'));

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

  return program;
}

function run(locale, args, usage) {
  console.log(usage ?? `$ program ${args.join(' ')}`);
  try {
    makeProgram(locale).parse(args, { from: 'user' });
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

run(locale, ['--help']);

// commander.missingArgument
run(locale, ['print']);

// commander.optionMissingArgument
run(locale, ['-d']);

// commander.missingMandatoryOptionValue
run(locale, ['ssh']);

// commander.conflictingOption
run(locale, ['answer', '--right', '--wrong']);
process.env.RIGHT = '1';
run(locale, ['answer', '--wrong'], '$ RIGHT=1 program answer --wrong');
delete process.env.RIGHT;

// commander.unknownOption
run(locale, ['--unknown']);

// commander.unknownCommand
run(locale, ['animal', 'unknown']);
// suggest similar
run(locale, ['animal', 'bat']);
run(locale, ['animal', 'rats']);

// commander.invalidArgument
run(locale, ['serve', '--port', 'NaN']);
run(locale, ['serve', 'NaN']);
run(locale, ['-c', 'foobar']);

process.env.PORT = 'nan';
run(locale, ['serve'], '$ PORT=nan program server');
delete process.env.PORT;

// commander.excessArguments
run(locale, ['1', '2', '3']);
run(locale, ['serve', '1', '2', '3']);

// Try the following:
//    node translations.js en
//    node translations.js zh-CN
