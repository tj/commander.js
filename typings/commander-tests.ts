import * as commander from './index';

// Test supported Commander usage in TypeScript.
// This is NOT a usable program! Just used to check for compile errors.

// Defined stricter type, as the options as properties `[key: string]: any`
// makes the type checking very weak. 
// https://github.com/Microsoft/TypeScript/issues/25987#issuecomment-441224690
type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends {[_ in keyof T]: infer U} ? ({} extends U ? never : U) : never;
type CommandWithoutOptionsAsProperties = Pick<commander.Command, KnownKeys<commander.Command>>;

const program: CommandWithoutOptionsAsProperties = commander.program;
const programWithOptions = commander.program;
// program.silly; // <-- Error, hurrah!

// Check for exported global Command objects
const importedDefaultProgram: commander.Command = commander;
const importedExplicitProgram: commander.Command = commander.program;

interface ExtendedOptions extends commander.CommandOptions {
    isNew: any;
}

const commandInstance = new commander.Command('clone');
const optionsInstance = new commander.Option('-f');
const errorInstance = new commander.CommanderError(1, 'code', 'message');

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
if (programWithOptions['peppers']) console.log('  - peppers');
if (programWithOptions['pineapple']) console.log('  - pineapple');
if (programWithOptions['bbq']) console.log('  - bbq');
console.log('  - %s cheese', programWithOptions['cheese']);

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

console.log(' int: %j', programWithOptions['integer']);
console.log(' float: %j', programWithOptions['float']);
console.log(' optional: %j', programWithOptions['optional']);
programWithOptions['range'] = programWithOptions['range'] || [];
console.log(' range: %j..%j', programWithOptions['range'][0], programWithOptions['range'][1]);
console.log(' list: %j', programWithOptions['list']);
console.log(' collect: %j', programWithOptions['collect']);
console.log(' verbosity: %j', programWithOptions['verbose']);
console.log(' args: %j', programWithOptions['args']);

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

const preparedCommand = new commander.Command('prepared');
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
program.parse();
program.parse(["foo"], { from: "user" });

program.parseAsync(process.argv).then(() => {
  console.log('parseAsync success');
}).catch(err => {
  console.log('parseAsync failed');
});

program.help();
program.outputHelp();
const info = program.helpInformation();

console.log('stuff');
