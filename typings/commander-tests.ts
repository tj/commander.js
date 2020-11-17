import * as commander from './index';

// Test Commander usage with TypeScript.
// This is NOT a usable program, just used to test for compile errors!

// We declare lots of variables just to check types of right-side of expression, so disable this:
/* eslint-disable @typescript-eslint/no-unused-vars */

// This conflicts with esline rule saying no space!
/* eslint-disable @typescript-eslint/space-before-function-paren */

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

// Check export classes exist
const commandInstance1 = new commander.Command();
const commandInstance2 = new commander.Command('name');
const optionsInstance = new commander.Option('-f');
const errorInstance = new commander.CommanderError(1, 'code', 'message');

// Command properties
console.log(programWithOptions.someOption);
// eslint-disable-next-line @typescript-eslint/dot-notation
console.log(programWithOptions['someOption']);
const theArgs = program.args;
const theCommands: commander.Command[] = program.commands;

// version
const versionThis1: commander.Command = program.version('1.2.3');
const versionThis2: commander.Command = program.version('1.2.3', '-r,--revision');
const versionThis3: commander.Command = program.version('1.2.3', '-r,--revision', 'show revision information');

// command (and CommandOptions)
const commandNew1: commander.Command = program.command('action');
const commandNew2: commander.Command = program.command('action', { isDefault: true, hidden: true, noHelp: true });
const commandThis1: commander.Command = program.command('exec', 'exec description');
const commandThis2: commander.Command = program.command('exec', 'exec description', { isDefault: true, hidden: true, noHelp: true, executableFile: 'foo' });

// addCommand
const addCommandThis: commander.Command = program.addCommand(new commander.Command('abc'));

// arguments
const argumentsThis: commander.Command = program.arguments('<cmd> [env]');

// addHelpCommand
const addHelpCommandThis1: commander.Command = program.addHelpCommand();
const addHelpCommandThis3: commander.Command = program.addHelpCommand(false);
const addHelpCommandThis2: commander.Command = program.addHelpCommand(true);
const addHelpCommandThis4: commander.Command = program.addHelpCommand('compress <file>');
const addHelpCommandThis5: commander.Command = program.addHelpCommand('compress <file>', 'compress target file');

// exitOverride
const exitThis1: commander.Command = program.exitOverride();
const exitThis2: commander.Command = program.exitOverride((err): never => {
  return process.exit(err.exitCode);
});
const exitThis3: commander.Command = program.exitOverride((err): void => {
  if (err.code !== 'commander.executeSubCommandAsync') {
    throw err;
  } else {
    // Async callback from spawn events, not useful to throw.
  }
});

// action
const actionThis1: commander.Command = program.action(() => {
  // do nothing.
});
const actionThis2: commander.Command = program.action(async() => {
  // do nothing.
});

// option
const optionThis1: commander.Command = program.option('-a,--alpha');
const optionThis2: commander.Command = program.option('-p, --peppers', 'Add peppers');
const optionThis3: commander.Command = program.option('-s, --string [value]', 'default string', 'value');
const optionThis4: commander.Command = program.option('-b, --boolean', 'default boolean', false);
program.option('--drink <size', 'drink size', /small|medium|large/);

// example coercion functions from README

function range(val: string): Number[] {
  return val.split('..').map(Number);
}

function myParseInt(value: string, dummyPrevious: number): number {
  return parseInt(value);
}

function increaseVerbosity(dummyValue: string, previous: number): number {
  return previous + 1;
}

function collect(value: string, previous: string[]): string[] {
  return previous.concat([value]);
}

function commaSeparatedList(value: string, dummyPrevious: string[]): string[] {
  return value.split(',');
}

const optionThis5: commander.Command = program.option('-f, --float <number>', 'float argument', parseFloat);
const optionThis6: commander.Command = program.option('-f, --float <number>', 'float argument', parseFloat, 3.2);
const optionThis7: commander.Command = program.option('-i, --integer <number>', 'integer argument', myParseInt);
const optionThis8: commander.Command = program.option('-i, --integer <number>', 'integer argument', myParseInt, 5);
const optionThis9: commander.Command = program.option('-v, --verbose', 'verbosity that can be increased', increaseVerbosity, 0);
const optionThis10: commander.Command = program.option('-c, --collect <value>', 'repeatable value', collect, []);
const optionThis11: commander.Command = program.option('-l, --list <items>', 'comma separated list', commaSeparatedList);

// requiredOption, same tests as option
const requiredOptionThis1: commander.Command = program.requiredOption('-a,--alpha');
const requiredOptionThis2: commander.Command = program.requiredOption('-p, --peppers', 'Add peppers');
const requiredOptionThis3: commander.Command = program.requiredOption('-s, --string [value]', 'default string', 'value');
const requiredOptionThis4: commander.Command = program.requiredOption('-b, --boolean', 'default boolean', false);
program.requiredOption('--drink <size', 'drink size', /small|medium|large/);

const requiredOptionThis5: commander.Command = program.requiredOption('-f, --float <number>', 'float argument', parseFloat);
const requiredOptionThis6: commander.Command = program.requiredOption('-f, --float <number>', 'float argument', parseFloat, 3.2);
const requiredOptionThis7: commander.Command = program.requiredOption('-i, --integer <number>', 'integer argument', myParseInt);
const requiredOptionThis8: commander.Command = program.requiredOption('-i, --integer <number>', 'integer argument', myParseInt, 5);
const requiredOptionThis9: commander.Command = program.requiredOption('-v, --verbose', 'verbosity that can be increased', increaseVerbosity, 0);
const requiredOptionThis10: commander.Command = program.requiredOption('-c, --collect <value>', 'repeatable value', collect, []);
const requiredOptionThis11: commander.Command = program.requiredOption('-l, --list <items>', 'comma separated list', commaSeparatedList);

// createOption
const createOption1: commander.Option = program.createOption('a, --alpha');
const createOption2: commander.Option = program.createOption('a, --alpha', 'description');

// addOption
const addOptionThis: commander.Command = program.addOption(new commander.Option('-s,--simple'));

// storeOptionsAsProperties
const storeOptionsAsPropertiesThis1: commander.Command = program.storeOptionsAsProperties();
const storeOptionsAsPropertiesThis2: commander.Command = program.storeOptionsAsProperties(false);

// passCommandToAction
const passCommandToActionThis1: commander.Command = program.passCommandToAction();
const passCommandToActionThis2: commander.Command = program.passCommandToAction(false);

// combineFlagAndOptionalValue
const combineFlagAndOptionalValueThis1: commander.Command = program.combineFlagAndOptionalValue();
const combineFlagAndOptionalValueThis2: commander.Command = program.combineFlagAndOptionalValue(false);

// allowUnknownOption
const allowUnknownOptionThis1: commander.Command = program.allowUnknownOption();
const allowUnknownOptionThis2: commander.Command = program.allowUnknownOption(false);

// parse
const parseThis1: commander.Command = program.parse();
const parseThis2: commander.Command = program.parse(process.argv);
const parseThis3: commander.Command = program.parse(['node', 'script.js'], { from: 'node' });
const parseThis4: commander.Command = program.parse(['node', 'script.js'], { from: 'electron' });
const parseThis5: commander.Command = program.parse(['--option'], { from: 'user' });

// parseAsync, same tests as parse
const parseAsyncThis1: Promise<commander.Command> = program.parseAsync();
const parseAsyncThis2: Promise<commander.Command> = program.parseAsync(process.argv);
const parseAsyncThis3: Promise<commander.Command> = program.parseAsync(['node', 'script.js'], { from: 'node' });
const parseAsyncThis4: Promise<commander.Command> = program.parseAsync(['node', 'script.js'], { from: 'electron' });
const parseAsyncThis5: Promise<commander.Command> = program.parseAsync(['--option'], { from: 'user' });

// parseOptions (and ParseOptionsResult)
const { operands, unknown } = program.parseOptions(['node', 'script.js', 'hello']);

// opts
const opts = program.opts();
const optsVal1 = opts.foo;
// eslint-disable-next-line @typescript-eslint/dot-notation
const opstVale2 = opts['bar'];

// description
const descriptionThis: commander.Command = program.description('my description');
const descriptionValue: string = program.description();

// alias
const aliasThis: commander.Command = program.alias('my alias');
const aliasValue: string = program.alias();

// aliases
const aliasesThis: commander.Command = program.aliases(['first-alias', 'second-alias']);
const aliasesValue: string[] = program.aliases();

// usage
const usageThis: commander.Command = program.usage('my usage');
const usageValue: string = program.usage();

// name
const nameThis: commander.Command = program.name('my-name');
const nameValue: string = program.name();

// outputHelp
program.outputHelp();
program.outputHelp((str: string) => { return str; });
program.outputHelp({ error: true });

// help
program.help();
program.help((str: string) => { return str; });
program.help({ error: true });

// helpInformation
const helpInformnationValue: string = program.helpInformation();

// helpOption
const helpOptionThis1: commander.Command = program.helpOption('-h,--help');
const helpOptionThis2: commander.Command = program.helpOption('-h,--help', 'custom description');
const helpOptionThis3: commander.Command = program.helpOption(undefined, 'custom description');
const helpOptionThis4: commander.Command = program.helpOption(false);

// addHelpText
const addHelpTextThis1: commander.Command = program.addHelpText('after', 'text');
const addHelpTextThis2: commander.Command = program.addHelpText('afterAll', 'text');
const addHelpTextThis3: commander.Command = program.addHelpText('before', () => 'before');
const addHelpTextThis4: commander.Command = program.addHelpText('beforeAll', (context: commander.AddHelpTextContext) => {
  if (context.error) {
    return; // Can return nothing to skip display
  }
  return context.command.name();
});

// on
const onThis: commander.Command = program.on('command:foo', () => {
  // do nothing.
});

// createCommand

const createInstance2: commander.Command = program.createCommand('name');

class MyCommand extends commander.Command {
  createCommand(name?: string): MyCommand {
    return new MyCommand(name);
  }

  myFunction(): void {
    // do nothing.
  }
}
const myProgram = new MyCommand();
myProgram.myFunction();
const mySub = myProgram.command('sub');
mySub.myFunction();

// configureHelp

const createHelpInstance: commander.Help = program.createHelp();
const configureHelpThis: commander.Command = program.configureHelp({
  sortSubcommands: true, // override property
  visibleCommands: (cmd: commander.Command) => [] // override method
});
const helpConfiguration: commander.HelpConfiguration = program.configureHelp();

// configureOutput
const configureOutputThis: commander.Command = program.configureOutput({ });
const configureOutputConfig: commander.OutputConfiguration = program.configureOutput();

program.configureOutput({
  writeOut: (str: string) => { },
  writeErr: (str: string) => { },
  getOutColumns: () => 80,
  getErrColumns: () => 80,
  outputError: (str: string, write: (str: string) => void) => { }
});

// Help
const helper = new commander.Help();
const helperCommand = new commander.Command();
const helperOption = new commander.Option('-a, --all');

helper.columns = 3;
helper.sortSubcommands = true;
helper.sortOptions = false;

const subcommandTermStr: string = helper.subcommandTerm(helperCommand);
const commandUsageStr: string = helper.commandUsage(helperCommand);
const commandDescriptionStr: string = helper.commandDescription(helperCommand);
const subcommandDescriptionStr: string = helper.subcommandDescription(helperCommand);
const optionTermStr: string = helper.optionTerm(helperOption);
const optionDescriptionStr: string = helper.optionDescription(helperOption);

const visibleCommands: commander.Command[] = helper.visibleCommands(helperCommand);
const visibleOptions: commander.Option[] = helper.visibleOptions(helperCommand);
const visibleArguments: Array<{ term: string; description: string}> = helper.visibleArguments(helperCommand);

const widestCommand: number = helper.longestSubcommandTermLength(helperCommand, helper);
const widestOption: number = helper.longestOptionTermLength(helperCommand, helper);
const widestArgument: number = helper.longestArgumentTermLength(helperCommand, helper);
const widest: number = helper.padWidth(helperCommand, helper);

const wrapped: string = helper.wrap('a b c', 50, 3);

const formatted: string = helper.formatHelp(helperCommand, helper);

// Option methods

const baseOption = new commander.Option('-f,--foo', 'foo description');

// default
const myOptionThis1: commander.Option = baseOption.default(3);
const myOptionThis2: commander.Option = baseOption.default(60, 'one minute');

// fullDescription
const optionDescription: string = baseOption.fullDescription();

// argParser
const myOptionThis3: commander.Option = baseOption.argParser((value: string) => parseInt(value));
const myOptionThis4: commander.Option = baseOption.argParser((value: string, previous: string[]) => { return previous.concat(value); });

// makeOptionMandatory
const myOptionThis5: commander.Option = baseOption.makeOptionMandatory();
const myOptionThis6: commander.Option = baseOption.makeOptionMandatory(true);

// hideHelp
const hideHelpThis1: commander.Option = baseOption.hideHelp();
const hideHelpThis2: commander.Option = baseOption.hideHelp(true);
const hideHelpThis3: commander.Option = baseOption.hideHelp(false);

// argumentRejected
function goodbye(): never {
  return baseOption.argumentRejected('failed');
};

// choices
const choicesThis: commander.Option = baseOption.choices(['a', 'b']);

// name
const optionName: string = baseOption.name();
