import * as program from './index';

interface ExtendedOptions extends program.CommandOptions {
    isNew: any;
}

const commandInstance = new program.Command('-f');
const optionsInstance = new program.Option('-f');
const errorInstance = new program.CommanderError(1, 'code', 'message');

const name = program.name();

program.storeOptionsAsProperties(true);
program.passCommandToAction(true);

program
    .name('set name')
    .version('0.0.1')
    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq', 'Add bbq sauce')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

console.log('you ordered a pizza with:');
if (program['peppers']) console.log('  - peppers');
if (program['pineapple']) console.log('  - pineapple');
if (program['bbq']) console.log('  - bbq');
console.log('  - %s cheese', program['cheese']);

function range(val: string) {
    return val.split('..').map(Number);
}

function list(val: string) {
    return val.split(',');
}

function collect(val: string, memo: string[]) {
    memo.push(val);
    return memo;
}

function increaseVerbosity(v: any, total: number) {
    return total + 1;
}

function syncCall() {
    console.log("Sync success!");
}

async function asyncCall() {
    return;
}

program
    .version('0.0.1')
    .usage('[options] <file ...>')
    .option('-i, --integer <n>', 'An integer argument', parseInt)
    .option('-f, --float <n>', 'A float argument', parseFloat)
    .option('-r, --range <a>..<b>', 'A range', range)
    .option('-l, --list <items>', 'A list', list)
    .option('-o, --optional [value]', 'An optional value')
    .option('-c, --collect [value]', 'A repeatable value', collect, [])
    .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
    .parse(process.argv);

console.log(' int: %j', program['integer']);
console.log(' float: %j', program['float']);
console.log(' optional: %j', program['optional']);
program['range'] = program['range'] || [];
console.log(' range: %j..%j', program['range'][0], program['range'][1]);
console.log(' list: %j', program['list']);
console.log(' collect: %j', program['collect']);
console.log(' verbosity: %j', program['verbose']);
console.log(' args: %j', program['args']);

program
    .version('0.0.1')
    .option('-f, --foo', 'enable some foo')
    .option('-b, --bar', 'enable some bar')
    .option('-B, --baz', 'enable some baz');

// must be before .parse()
program.on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ custom-help --help');
    console.log('    $ custom-help -h');
    console.log('');
});

program
    .command('allow-unknown-option')
    .description("description")
    .allowUnknownOption()
    .action(() => {
        console.log('unknown option is allowed');
    });

program
  .requiredOption('-a,--aaa', 'description')
  .requiredOption('-b,--bbb <value>', 'description')
  .requiredOption('-c,--ccc [value]', 'description')
  .requiredOption('-d,--ddd <value>', 'description', 'default value')
  .requiredOption('-e,--eee <value>', 'description', (value, memo) => { return value; })
  .requiredOption('-f,--fff <value>', 'description', (value, memo) => { return value; }, 'starting value')
  .requiredOption('-g,--ggg <value>', 'description')
  .requiredOption('-G,--no-ggg <value>', 'description for negation');

program
    .version('0.0.1')
    .arguments('<cmd> [env]')
    .action((cmd, env) => {
        console.log(cmd, env);
    });

program
    .command("name1", "description")
    .command("name2", "description", { isDefault:true });

program
    .command("name3").action(syncCall)
    .command("name4").action(asyncCall);

const preparedCommand = new program.Command('prepared');
program.addCommand(preparedCommand);

program
    .exitOverride();

program.exitOverride((err):never => {
  console.log(err.code);
  console.log(err.message);
  console.log(err.nestedError);
  return process.exit(err.exitCode);
});

program.exitOverride((err):void => {
  if (err.code !== 'commander.executeSubCommandAsync') {
    throw err;
  } else {
    // Async callback from spawn events, not useful to throw.
  }
});

program.parse(process.argv);

program.parseAsync(process.argv).then(() => {
  console.log('parseAsync success');
}).catch(err => {
  console.log('parseAsync failed');
});

console.log('stuff');
