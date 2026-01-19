import * as commander from './index';
import { expectType } from 'tsd';

// We are not just checking return types here, we are also implicitly checking that the expected syntax is allowed.

const program: commander.Command = new commander.Command();
// @ts-expect-error Check that Command is strongly typed and does not allow arbitrary properties
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
program.silly; // <-- Error, hurrah!

// Check for exported global Command object
expectType<commander.Command>(commander.program);

// Check export classes and functions exist
expectType<commander.Command>(new commander.Command());
expectType<commander.Command>(new commander.Command('name'));
expectType<commander.Option>(new commander.Option('-f'));
expectType<commander.CommanderError>(
  new commander.CommanderError(1, 'code', 'message'),
);
expectType<commander.InvalidArgumentError>(
  new commander.InvalidArgumentError('message'),
);
expectType<commander.InvalidArgumentError>(
  new commander.InvalidOptionArgumentError('message'),
);
expectType<commander.Command>(commander.createCommand());
expectType<commander.Option>(commander.createOption('--demo'));
expectType<commander.Argument>(commander.createArgument('<foo>'));

// Command properties
expectType<string[]>(program.args);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
expectType<any[]>(program.processedArgs);
expectType<readonly commander.Command[]>(program.commands);
expectType<readonly commander.Option[]>(program.options);
expectType<readonly commander.Argument[]>(program.registeredArguments);
expectType<commander.Command | null>(program.parent);

// version
expectType<commander.Command>(program.version('1.2.3'));
expectType<commander.Command>(program.version('1.2.3', '-r,--revision'));
expectType<commander.Command>(
  program.version('1.2.3', '-r,--revision', 'show revision information'),
);
expectType<string | undefined>(program.version());

// command (and CommandOptions)
expectType<commander.Command>(program.command('action'));
expectType<commander.Command>(
  program.command('action', { isDefault: true, hidden: true, noHelp: true }),
);
expectType<commander.Command>(program.command('exec', 'exec description'));
expectType<commander.Command>(
  program.command('exec', 'exec description', {
    isDefault: true,
    hidden: true,
    noHelp: true,
    executableFile: 'foo',
  }),
);

// addCommand
expectType<commander.Command>(program.addCommand(new commander.Command('abc')));

// argument
expectType<commander.Command>(program.argument('<value>'));
expectType<commander.Command>(program.argument('<value>', 'description'));
expectType<commander.Command>(
  program.argument('[value]', 'description', 'default'),
);
expectType<commander.Command>(
  program.argument('[value]', 'description', parseFloat),
);
expectType<commander.Command>(
  program.argument('[value]', 'description', parseFloat, 1.23),
);

// arguments
expectType<commander.Command>(program.arguments('<cmd> [env]'));

// addHelpCommand
expectType<commander.Command>(
  program.addHelpCommand(new commander.Command('assist')),
);
// Deprecated uses
expectType<commander.Command>(program.addHelpCommand());
expectType<commander.Command>(program.addHelpCommand(false));
expectType<commander.Command>(program.addHelpCommand(true));
expectType<commander.Command>(program.addHelpCommand('assist [cmd]'));
expectType<commander.Command>(
  program.addHelpCommand('assist [file]', 'display help'),
);

// helpCommand
expectType<commander.Command>(program.helpCommand(false));
expectType<commander.Command>(program.helpCommand(true));
expectType<commander.Command>(program.helpCommand('assist [cmd]'));
expectType<commander.Command>(
  program.helpCommand('assist [file]', 'display help'),
);

// exitOverride
expectType<commander.Command>(program.exitOverride());
expectType<commander.Command>(
  program.exitOverride((err): never => {
    return process.exit(err.exitCode);
  }),
);
expectType<commander.Command>(
  program.exitOverride((err): void => {
    if (err.code !== 'commander.executeSubCommandAsync') {
      throw err;
    } else {
      // Async callback from spawn events, not useful to throw.
    }
  }),
);

// error
expectType<never>(program.error('Goodbye'));
expectType<never>(program.error('Goodbye', { code: 'my.error' }));
expectType<never>(program.error('Goodbye', { exitCode: 2 }));
expectType<never>(program.error('Goodbye', { code: 'my.error', exitCode: 2 }));

// hook
expectType<commander.Command>(program.hook('preAction', () => {}));
expectType<commander.Command>(program.hook('postAction', () => {}));
expectType<commander.Command>(program.hook('preAction', async () => {}));
expectType<commander.Command>(
  program.hook('preAction', (thisCommand, actionCommand) => {
    // implicit parameter types
    expectType<commander.Command>(thisCommand);
    expectType<commander.Command>(actionCommand);
  }),
);
expectType<commander.Command>(program.hook('preSubcommand', () => {}));
expectType<commander.Command>(
  program.hook('preSubcommand', (thisCommand, subcommand) => {
    // implicit parameter types
    expectType<commander.Command>(thisCommand);
    expectType<commander.Command>(subcommand);
  }),
);

// action
expectType<commander.Command>(program.action(() => {}));
expectType<commander.Command>(program.action(async () => {}));
program.action(function () {
  expectType<typeof program>(this);
});

// option
expectType<commander.Command>(program.option('-a,--alpha'));
expectType<commander.Command>(program.option('-p, --peppers', 'Add peppers'));
expectType<commander.Command>(
  program.option('-s, --string [value]', 'default string', 'value'),
);
expectType<commander.Command>(
  program.option('-b, --boolean', 'default boolean', false),
);
expectType<commander.Command>(
  program.option('--drink <size', 'drink size', /small|medium|large/),
); // deprecated

// example coercion functions from README

function myParseInt(value: string): number {
  return parseInt(value);
}

function increaseVerbosity(dummyValue: string, previous: number): number {
  return previous + 1;
}

function collect(value: string, previous: string[]): string[] {
  return previous.concat([value]);
}

function commaSeparatedList(value: string): string[] {
  return value.split(',');
}

expectType<commander.Command>(
  program.option('-f, --float <number>', 'float argument', parseFloat),
);
expectType<commander.Command>(
  program.option('-f, --float <number>', 'float argument', parseFloat, 3.2),
);
expectType<commander.Command>(
  program.option('-i, --integer <number>', 'integer argument', myParseInt),
);
expectType<commander.Command>(
  program.option('-i, --integer <number>', 'integer argument', myParseInt, 5),
);
expectType<commander.Command>(
  program.option(
    '-v, --verbose',
    'verbosity that can be increased',
    increaseVerbosity,
    0,
  ),
);
expectType<commander.Command>(
  program.option('-c, --collect <value>', 'repeatable value', collect, []),
);
expectType<commander.Command>(
  program.option(
    '-l, --list <items>',
    'comma separated list',
    commaSeparatedList,
  ),
);

// requiredOption, same tests as option
expectType<commander.Command>(program.requiredOption('-a,--alpha'));
expectType<commander.Command>(
  program.requiredOption('-p, --peppers', 'Add peppers'),
);
expectType<commander.Command>(
  program.requiredOption('-s, --string [value]', 'default string', 'value'),
);
expectType<commander.Command>(
  program.requiredOption('-b, --boolean', 'default boolean', false),
);
expectType<commander.Command>(
  program.requiredOption('--drink <size', 'drink size', /small|medium|large/),
); // deprecated

expectType<commander.Command>(
  program.requiredOption('-f, --float <number>', 'float argument', parseFloat),
);
expectType<commander.Command>(
  program.requiredOption(
    '-f, --float <number>',
    'float argument',
    parseFloat,
    3.2,
  ),
);
expectType<commander.Command>(
  program.requiredOption(
    '-i, --integer <number>',
    'integer argument',
    myParseInt,
  ),
);
expectType<commander.Command>(
  program.requiredOption(
    '-i, --integer <number>',
    'integer argument',
    myParseInt,
    5,
  ),
);
expectType<commander.Command>(
  program.requiredOption(
    '-v, --verbose',
    'verbosity that can be increased',
    increaseVerbosity,
    0,
  ),
);
expectType<commander.Command>(
  program.requiredOption(
    '-c, --collect <value>',
    'repeatable value',
    collect,
    [],
  ),
);
expectType<commander.Command>(
  program.requiredOption(
    '-l, --list <items>',
    'comma separated list',
    commaSeparatedList,
  ),
);

// createOption
expectType<commander.Option>(program.createOption('a, --alpha'));
expectType<commander.Option>(program.createOption('a, --alpha', 'description'));

// addOption
expectType<commander.Command>(
  program.addOption(new commander.Option('-s,--simple')),
);

// storeOptionsAsProperties
expectType<commander.Command & commander.OptionValues>(
  program.storeOptionsAsProperties(),
);
expectType<commander.Command & commander.OptionValues>(
  program.storeOptionsAsProperties(true),
);
expectType<commander.Command>(program.storeOptionsAsProperties(false));

// getOptionValue
void program.getOptionValue('example');

// setOptionValue
expectType<commander.Command>(program.setOptionValue('example', 'value'));
expectType<commander.Command>(program.setOptionValue('example', true));

// setOptionValueWithSource
expectType<commander.Command>(
  program.setOptionValueWithSource('example', [], 'cli'),
);

// getOptionValueSource
expectType<commander.OptionValueSource | undefined>(
  program.getOptionValueSource('example'),
);

// getOptionValueSourceWithGlobals
expectType<commander.OptionValueSource | undefined>(
  program.getOptionValueSourceWithGlobals('example'),
);

// combineFlagAndOptionalValue
expectType<commander.Command>(program.combineFlagAndOptionalValue());
expectType<commander.Command>(program.combineFlagAndOptionalValue(false));

// allowUnknownOption
expectType<commander.Command>(program.allowUnknownOption());
expectType<commander.Command>(program.allowUnknownOption(false));

// allowExcessArguments
expectType<commander.Command>(program.allowExcessArguments());
expectType<commander.Command>(program.allowExcessArguments(false));

// enablePositionalOptions
expectType<commander.Command>(program.enablePositionalOptions());
expectType<commander.Command>(program.enablePositionalOptions(false));

// passThroughOptions
expectType<commander.Command>(program.passThroughOptions());
expectType<commander.Command>(program.passThroughOptions(false));

// parse
expectType<commander.Command>(program.parse());
expectType<commander.Command>(program.parse(process.argv));
expectType<commander.Command>(
  program.parse(['node', 'script.js'], { from: 'node' }),
);
expectType<commander.Command>(
  program.parse(['node', 'script.js'], { from: 'electron' }),
);
expectType<commander.Command>(program.parse(['--option'], { from: 'user' }));
expectType<commander.Command>(program.parse(['node', 'script.js'] as const));

// parseAsync, same tests as parse
expectType<Promise<commander.Command>>(program.parseAsync());
expectType<Promise<commander.Command>>(program.parseAsync(process.argv));
expectType<Promise<commander.Command>>(
  program.parseAsync(['node', 'script.js'], { from: 'node' }),
);
expectType<Promise<commander.Command>>(
  program.parseAsync(['node', 'script.js'], { from: 'electron' }),
);
expectType<Promise<commander.Command>>(
  program.parseAsync(['--option'], { from: 'user' }),
);
expectType<Promise<commander.Command>>(
  program.parseAsync(['node', 'script.js'] as const),
);

// parseOptions (and ParseOptionsResult)
expectType<{ operands: string[]; unknown: string[] }>(
  program.parseOptions(['node', 'script.js', 'hello']),
);

// save/restore state
expectType<void>(program.saveStateBeforeParse());
expectType<void>(program.restoreStateBeforeParse());

// opts
const opts = program.opts();
expectType<commander.OptionValues>(opts);
expectType(opts.foo);
expectType(opts.bar);

// opts with generics
interface MyCheeseOption {
  cheese: string;
}
const myCheeseOption = program.opts<MyCheeseOption>();
expectType<string>(myCheeseOption.cheese);
// @ts-expect-error Check that options strongly typed and does not allow arbitrary properties
expectType(myCheeseOption.foo);

// optsWithGlobals
const optsWithGlobals = program.optsWithGlobals();
expectType<commander.OptionValues>(optsWithGlobals);
expectType(optsWithGlobals.foo);
expectType(optsWithGlobals.bar);

// optsWithGlobals with generics
const myCheeseOptionWithGlobals = program.optsWithGlobals<MyCheeseOption>();
expectType<string>(myCheeseOptionWithGlobals.cheese);
// @ts-expect-error Check that options strongly typed and does not allow arbitrary properties
expectType(myCheeseOptionWithGlobals.foo);

// description
expectType<commander.Command>(program.description('my description'));
expectType<string>(program.description());
expectType<commander.Command>(
  program.description('my description of command with arg foo', {
    foo: 'foo description',
  }),
); // deprecated

// summary
expectType<commander.Command>(program.summary('my summary'));
expectType<string>(program.summary());

// alias
expectType<commander.Command>(program.alias('my alias'));
expectType<string>(program.alias());

// aliases
expectType<commander.Command>(program.aliases(['first-alias', 'second-alias']));
expectType<commander.Command>(
  program.aliases(['first-alias', 'second-alias'] as const),
);
expectType<string[]>(program.aliases());

// usage
expectType<commander.Command>(program.usage('my usage'));
expectType<string>(program.usage());

// name
expectType<commander.Command>(program.name('my-name'));
expectType<string>(program.name());

// helpGroup related
expectType<commander.Command>(program.helpGroup('My Group'));
expectType<string>(program.helpGroup());

expectType<commander.Command>(program.commandsGroup('My Group'));
expectType<string>(program.commandsGroup());

expectType<commander.Command>(program.optionsGroup('My Group'));
expectType<string>(program.optionsGroup());

// nameFromFilename
expectType<commander.Command>(program.nameFromFilename(__filename));

// executableDir
expectType<commander.Command>(program.executableDir(__dirname));
expectType<string | null>(program.executableDir());

// outputHelp
expectType<void>(program.outputHelp());
expectType<void>(
  program.outputHelp((str: string) => {
    return str;
  }),
);
expectType<void>(program.outputHelp({ error: true }));

// help
expectType<never>(program.help());
expectType<never>(
  program.help((str: string) => {
    return str;
  }),
);
expectType<never>(program.help({ error: true }));

// helpInformation
expectType<string>(program.helpInformation());
expectType<string>(program.helpInformation({ error: true }));

// helpOption
expectType<commander.Command>(program.helpOption('-h,--help'));
expectType<commander.Command>(
  program.helpOption('-h,--help', 'custom description'),
);
expectType<commander.Command>(
  program.helpOption(undefined, 'custom description'),
);
expectType<commander.Command>(program.helpOption(false));

// addHelpOption
expectType<commander.Command>(
  program.addHelpOption(new commander.Option('-h,--help')),
);

// addHelpText
expectType<commander.Command>(program.addHelpText('after', 'text'));
expectType<commander.Command>(program.addHelpText('afterAll', 'text'));
expectType<commander.Command>(program.addHelpText('before', () => 'before'));
expectType<commander.Command>(
  program.addHelpText('beforeAll', (context) => {
    expectType<boolean>(context.error);
    expectType<commander.Command>(context.command);
    return '';
  }),
);

// on
expectType<commander.Command>(program.on('command:foo', () => {}));

// createCommand
expectType<commander.Command>(program.createCommand());
expectType<commander.Command>(program.createCommand('name'));

class MyCommand extends commander.Command {
  createCommand(name?: string): MyCommand {
    return new MyCommand(name);
  }

  myFunction(): void {
    // do nothing.
  }
}
const myProgram = new MyCommand();
expectType<MyCommand>(myProgram.command('sub'));

// configureHelp
expectType<commander.Help>(program.createHelp());
expectType<commander.Command>(
  program.configureHelp({
    sortSubcommands: true, // override property
    visibleCommands: () => [], // override method
  }),
);
expectType<commander.HelpConfiguration>(program.configureHelp());

// copyInheritedSettings
expectType<commander.Command>(
  program.copyInheritedSettings(new commander.Command()),
);

// showHelpAfterError
expectType<commander.Command>(program.showHelpAfterError());
expectType<commander.Command>(program.showHelpAfterError(true));
expectType<commander.Command>(program.showHelpAfterError('See --help'));

// showSuggestionAfterError
expectType<commander.Command>(program.showSuggestionAfterError());
expectType<commander.Command>(program.showSuggestionAfterError(false));

// configureOutput
expectType<commander.Command>(program.configureOutput({}));
expectType<commander.OutputConfiguration>(program.configureOutput());

expectType<commander.Command>(
  program.configureOutput({
    writeOut: (str: string) => {
      console.log(str);
    },
    writeErr: (str: string) => {
      console.error(str);
    },
    outputError: (str: string, write: (str: string) => void) => {
      write(str);
    },

    getOutHelpWidth: () => 80,
    getErrHelpWidth: () => 80,

    getOutHasColors: () => true,
    getErrHasColors: () => true,
    stripColor: (str) => str,
  }),
);

// Help
const helper = new commander.Help();
const helperCommand = new commander.Command();
const helperOption = new commander.Option('-a, --all');
const helperArgument = new commander.Argument('<file>');

helper.prepareContext({});
helper.prepareContext({ helpWidth: 120, error: true, outputHasColors: false });

expectType<number | undefined>(helper.helpWidth);
expectType<number>(helper.minWidthToWrap);
expectType<boolean>(helper.sortSubcommands);
expectType<boolean>(helper.sortOptions);
expectType<boolean>(helper.showGlobalOptions);

expectType<string>(helper.subcommandTerm(helperCommand));
expectType<string>(helper.commandUsage(helperCommand));
expectType<string>(helper.commandDescription(helperCommand));
expectType<string>(helper.subcommandDescription(helperCommand));
expectType<string>(helper.optionTerm(helperOption));
expectType<string>(helper.optionDescription(helperOption));
expectType<string>(helper.argumentTerm(helperArgument));
expectType<string>(helper.argumentDescription(helperArgument));

expectType<commander.Command[]>(helper.visibleCommands(helperCommand));
expectType<commander.Option[]>(helper.visibleOptions(helperCommand));
expectType<commander.Option[]>(helper.visibleGlobalOptions(helperCommand));
expectType<commander.Argument[]>(helper.visibleArguments(helperCommand));

expectType<number>(helper.longestSubcommandTermLength(helperCommand, helper));
expectType<number>(helper.longestOptionTermLength(helperCommand, helper));
expectType<number>(helper.longestGlobalOptionTermLength(helperCommand, helper));
expectType<number>(helper.longestArgumentTermLength(helperCommand, helper));
expectType<number>(helper.padWidth(helperCommand, helper));

expectType<number>(helper.displayWidth('some string'));
expectType<string>(helper.boxWrap('a b c', 50));
expectType<string>(
  helper.formatItem('--example', 12, 'example description', helper),
);
expectType<boolean>(helper.preformatted('a\nb c'));

{
  const formattedItems = [
    '--example  example description',
    '--example2 example2 description',
  ];
  expectType<string[]>(
    helper.formatItemList('Options', formattedItems, helper),
  );
}

{
  const unsortedOptions = [new commander.Option('-a, --all')];
  const sortedOptions = unsortedOptions;
  const groupsItemsOptionHeading = (option: commander.Option) =>
    option.helpGroupHeading ?? 'Options:';
  expectType<Map<string, commander.Option[]>>(
    helper.groupItems(unsortedOptions, sortedOptions, groupsItemsOptionHeading),
  );
}

{
  const unsortedCommands = [new commander.Command('foo')];
  const sortedCommands = unsortedCommands;
  const groupsItemsCommandHeading = (cmd: commander.Command) =>
    cmd.helpGroup() ?? 'Commands:';
  expectType<Map<string, commander.Command[]>>(
    helper.groupItems(
      unsortedCommands,
      sortedCommands,
      groupsItemsCommandHeading,
    ),
  );
}

expectType<string>(helper.styleTitle('Usage:'));

expectType<string>(helper.styleUsage('foo [options] <file>'));
expectType<string>(helper.styleCommandText('foo'));

expectType<string>(helper.styleCommandDescription('description'));
expectType<string>(helper.styleOptionDescription('description'));
expectType<string>(helper.styleSubcommandDescription('description'));
expectType<string>(helper.styleArgumentDescription('description'));
expectType<string>(helper.styleDescriptionText('description'));

expectType<string>(helper.styleOptionTerm('-a, --all'));
expectType<string>(helper.styleSubcommandTerm('bar [options]'));
expectType<string>(helper.styleArgumentTerm('<file>'));

expectType<string>(helper.styleOptionText('-a, --all'));
expectType<string>(helper.styleSubcommandText('bar'));
expectType<string>(helper.styleArgumentText('<file>'));

expectType<string>(helper.formatHelp(helperCommand, helper));

// Option properties
const baseOption = new commander.Option('-f,--foo', 'foo description');
expectType<string>(baseOption.flags);
expectType<string>(baseOption.description);
expectType<boolean>(baseOption.required);
expectType<boolean>(baseOption.optional);
expectType<boolean>(baseOption.variadic);
expectType<boolean>(baseOption.mandatory);
expectType<string | undefined>(baseOption.short);
expectType<string | undefined>(baseOption.long);
expectType<boolean>(baseOption.negate);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
expectType<any>(baseOption.defaultValue);
expectType<string | undefined>(baseOption.defaultValueDescription);
expectType<unknown>(baseOption.presetArg);
expectType<string | undefined>(baseOption.envVar);
expectType<boolean>(baseOption.hidden);
expectType<string[] | undefined>(baseOption.argChoices);
expectType<string | undefined>(baseOption.helpGroupHeading);

// Option methods

// default
expectType<commander.Option>(baseOption.default(3));
expectType<commander.Option>(baseOption.default(60, 'one minute'));

// preset
expectType<commander.Option>(baseOption.preset(123));
expectType<commander.Option>(baseOption.preset('abc'));

// env
expectType<commander.Option>(baseOption.env('PORT'));

// argParser
expectType<commander.Option>(
  baseOption.argParser((value: string) => parseInt(value)),
);
expectType<commander.Option>(
  baseOption.argParser((value: string, previous: string[]) => {
    return previous.concat(value);
  }),
);

// makeOptionMandatory
expectType<commander.Option>(baseOption.makeOptionMandatory());
expectType<commander.Option>(baseOption.makeOptionMandatory(true));

// hideHelp
expectType<commander.Option>(baseOption.hideHelp());
expectType<commander.Option>(baseOption.hideHelp(true));
expectType<commander.Option>(baseOption.hideHelp(false));

// choices
expectType<commander.Option>(baseOption.choices(['a', 'b']));
expectType<commander.Option>(baseOption.choices(['a', 'b'] as const));

// conflicts
expectType<commander.Option>(baseOption.conflicts('a'));
expectType<commander.Option>(baseOption.conflicts(['a', 'b']));

// implies
expectType<commander.Option>(
  baseOption.implies({ option: 'VALUE', colour: false }),
);

// name
expectType<string>(baseOption.name());

// attributeName
expectType<string>(baseOption.attributeName());

// helpGroup
expectType<commander.Option>(baseOption.helpGroup('My Group'));
// @ts-expect-error: Option helpGroup() can not be used as a getter.
baseOption.helpGroup();

// isBoolean
expectType<boolean>(baseOption.isBoolean());

// Argument properties
const baseArgument = new commander.Argument('<foo');
expectType<string>(baseArgument.description);
expectType<boolean>(baseArgument.required);
expectType<boolean>(baseArgument.variadic);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
expectType<any>(baseArgument.defaultValue);
expectType<string | undefined>(baseArgument.defaultValueDescription);
expectType<string[] | undefined>(baseArgument.argChoices);

// Argument methods

// name
expectType<string>(baseArgument.name());

// default
expectType<commander.Argument>(baseArgument.default(3));
expectType<commander.Argument>(baseArgument.default(60, 'one minute'));

// argParser
expectType<commander.Argument>(
  baseArgument.argParser((value: string) => parseInt(value)),
);
expectType<commander.Argument>(
  baseArgument.argParser((value: string, previous: string[]) => {
    return previous.concat(value);
  }),
);

// choices
expectType<commander.Argument>(baseArgument.choices(['a', 'b']));
expectType<commander.Argument>(baseArgument.choices(['a', 'b'] as const));

// argRequired
expectType<commander.Argument>(baseArgument.argRequired());

// argOptional
expectType<commander.Argument>(baseArgument.argOptional());

// createArgument
expectType<commander.Argument>(program.createArgument('<name>'));
expectType<commander.Argument>(program.createArgument('<name>', 'description'));
