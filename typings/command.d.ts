/// <reference types="node" />
export class Command extends EventEmitter {
    /**
     * Initialize a new `Command`.
     *
     * @param {string} [name]
     */
    constructor(name?: string | undefined);
    /** @type {Command[]} */
    commands: Command[];
    /** @type {Option[]} */
    options: Option[];
    parent: any;
    _allowUnknownOption: boolean;
    _allowExcessArguments: boolean;
    /** @type {Argument[]} */
    _args: Argument[];
    /** @type {string[]} */
    args: string[];
    rawArgs: any[];
    processedArgs: any[];
    _scriptPath: any;
    _name: string;
    _optionValues: {};
    _optionValueSources: {};
    _storeOptionsAsProperties: boolean;
    _actionHandler: ((args: any) => any) | null;
    _executableHandler: boolean;
    _executableFile: any;
    _executableDir: string | null;
    _defaultCommandName: string | null;
    _exitCallback: any;
    _aliases: any[];
    _combineFlagAndOptionalValue: boolean;
    _description: string;
    _summary: string;
    _argsDescription: any;
    _enablePositionalOptions: boolean;
    _passThroughOptions: boolean;
    _lifeCycleHooks: {};
    /** @type {boolean | string} */
    _showHelpAfterError: boolean | string;
    _showSuggestionAfterError: boolean;
    _outputConfiguration: {
        writeOut: (str: any) => boolean;
        writeErr: (str: any) => boolean;
        getOutHelpWidth: () => number | undefined;
        getErrHelpWidth: () => number | undefined;
        outputError: (str: any, write: any) => any;
    };
    _hidden: boolean;
    _hasHelpOption: boolean;
    _helpFlags: string;
    _helpDescription: string;
    _helpShortFlag: string;
    _helpLongFlag: string;
    _addImplicitHelpCommand: boolean | undefined;
    _helpCommandName: string;
    _helpCommandnameAndArgs: string;
    _helpCommandDescription: string;
    _helpConfiguration: {};
    /**
     * Copy settings that are useful to have in common across root command and subcommands.
     *
     * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
     *
     * @param {Command} sourceCommand
     * @return {Command} `this` command for chaining
     */
    copyInheritedSettings(sourceCommand: Command): Command;
    /**
     * Define a command.
     *
     * There are two styles of command: pay attention to where to put the description.
     *
     * @example
     * // Command implemented using action handler (description is supplied separately to `.command`)
     * program
     *   .command('clone <source> [destination]')
     *   .description('clone a repository into a newly created directory')
     *   .action((source, destination) => {
     *     console.log('clone command called');
     *   });
     *
     * // Command implemented using separate executable file (description is second parameter to `.command`)
     * program
     *   .command('start <service>', 'start named service')
     *   .command('stop [service]', 'stop named service, or all if no name supplied');
     *
     * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
     * @param {Object|string} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
     * @param {Object} [execOpts] - configuration options (for executable)
     * @return {Command} returns new command for action handler, or `this` for executable command
     */
    command(nameAndArgs: string, actionOptsOrExecDesc?: any | string, execOpts?: any): Command;
    /**
     * Factory routine to create a new unattached command.
     *
     * See .command() for creating an attached subcommand, which uses this routine to
     * create the command. You can override createCommand to customise subcommands.
     *
     * @param {string} [name]
     * @return {Command} new command
     */
    createCommand(name?: string | undefined): Command;
    /**
     * You can customise the help with a subclass of Help by overriding createHelp,
     * or by overriding Help properties using configureHelp().
     *
     * @return {Help}
     */
    createHelp(): Help;
    /**
     * You can customise the help by overriding Help properties using configureHelp(),
     * or with a subclass of Help by overriding createHelp().
     *
     * @param {Object} [configuration] - configuration options
     * @return {Command|Object} `this` command for chaining, or stored configuration
     */
    configureHelp(configuration?: any): Command | any;
    /**
     * The default output goes to stdout and stderr. You can customise this for special
     * applications. You can also customise the display of errors by overriding outputError.
     *
     * The configuration properties are all functions:
     *
     *     // functions to change where being written, stdout and stderr
     *     writeOut(str)
     *     writeErr(str)
     *     // matching functions to specify width for wrapping help
     *     getOutHelpWidth()
     *     getErrHelpWidth()
     *     // functions based on what is being written out
     *     outputError(str, write) // used for displaying errors, and not used for displaying help
     *
     * @param {Object} [configuration] - configuration options
     * @return {Command|Object} `this` command for chaining, or stored configuration
     */
    configureOutput(configuration?: any): Command | any;
    /**
     * Display the help or a custom message after an error occurs.
     *
     * @param {boolean|string} [displayHelp]
     * @return {Command} `this` command for chaining
     */
    showHelpAfterError(displayHelp?: string | boolean | undefined): Command;
    /**
     * Display suggestion of similar commands for unknown commands, or options for unknown options.
     *
     * @param {boolean} [displaySuggestion]
     * @return {Command} `this` command for chaining
     */
    showSuggestionAfterError(displaySuggestion?: boolean | undefined): Command;
    /**
     * Add a prepared subcommand.
     *
     * See .command() for creating an attached subcommand which inherits settings from its parent.
     *
     * @param {Command} cmd - new subcommand
     * @param {Object} [opts] - configuration options
     * @return {Command} `this` command for chaining
     */
    addCommand(cmd: Command, opts?: any): Command;
    /**
     * Factory routine to create a new unattached argument.
     *
     * See .argument() for creating an attached argument, which uses this routine to
     * create the argument. You can override createArgument to return a custom argument.
     *
     * @param {string} name
     * @param {string} [description]
     * @return {Argument} new argument
     */
    createArgument(name: string, description?: string | undefined): Argument;
    /**
     * Define argument syntax for command.
     *
     * The default is that the argument is required, and you can explicitly
     * indicate this with <> around the name. Put [] around the name for an optional argument.
     *
     * @example
     * program.argument('<input-file>');
     * program.argument('[output-file]');
     *
     * @param {string} name
     * @param {string} [description]
     * @param {Function|*} [fn] - custom argument processing function
     * @param {*} [defaultValue]
     * @return {Command} `this` command for chaining
     */
    argument(name: string, description?: string | undefined, fn?: Function | any, defaultValue?: any): Command;
    /**
     * Define argument syntax for command, adding multiple at once (without descriptions).
     *
     * See also .argument().
     *
     * @example
     * program.arguments('<cmd> [env]');
     *
     * @param {string} names
     * @return {Command} `this` command for chaining
     */
    arguments(names: string): Command;
    /**
     * Define argument syntax for command, adding a prepared argument.
     *
     * @param {Argument} argument
     * @return {Command} `this` command for chaining
     */
    addArgument(argument: Argument): Command;
    /**
     * Override default decision whether to add implicit help command.
     *
     *    addHelpCommand() // force on
     *    addHelpCommand(false); // force off
     *    addHelpCommand('help [cmd]', 'display help for [cmd]'); // force on with custom details
     *
     * @return {Command} `this` command for chaining
     */
    addHelpCommand(enableOrNameAndArgs: any, description: any): Command;
    /**
     * @return {boolean}
     * @package
     */
    _hasImplicitHelpCommand(): boolean;
    /**
     * Add hook for life cycle event.
     *
     * @param {string} event
     * @param {Function} listener
     * @return {Command} `this` command for chaining
     */
    hook(event: string, listener: Function): Command;
    /**
     * Register callback to use as replacement for calling process.exit.
     *
     * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
     * @return {Command} `this` command for chaining
     */
    exitOverride(fn?: Function | undefined): Command;
    /**
     * Call process.exit, and _exitCallback if defined.
     *
     * @param {number} exitCode exit code for using with process.exit
     * @param {string} code an id string representing the error
     * @param {string} message human-readable description of the error
     * @return never
     * @package
     */
    _exit(exitCode: number, code: string, message: string): void;
    /**
     * Register callback `fn` for the command.
     *
     * @example
     * program
     *   .command('serve')
     *   .description('start service')
     *   .action(function() {
     *      // do work here
     *   });
     *
     * @param {Function} fn
     * @return {Command} `this` command for chaining
     */
    action(fn: Function): Command;
    /**
     * Factory routine to create a new unattached option.
     *
     * See .option() for creating an attached option, which uses this routine to
     * create the option. You can override createOption to return a custom option.
     *
     * @param {string} flags
     * @param {string} [description]
     * @return {Option} new option
     */
    createOption(flags: string, description?: string | undefined): Option;
    /**
     * Add an option.
     *
     * @param {Option} option
     * @return {Command} `this` command for chaining
     */
    addOption(option: Option): Command;
    /**
     * Internal implementation shared by .option() and .requiredOption()
     *
     * @package
     */
    _optionEx(config: any, flags: any, description: any, fn: any, defaultValue: any): Command;
    /**
     * Define option with `flags`, `description` and optional
     * coercion `fn`.
     *
     * The `flags` string contains the short and/or long flags,
     * separated by comma, a pipe or space. The following are all valid
     * all will output this way when `--help` is used.
     *
     *     "-p, --pepper"
     *     "-p|--pepper"
     *     "-p --pepper"
     *
     * @example
     * // simple boolean defaulting to undefined
     * program.option('-p, --pepper', 'add pepper');
     *
     * program.pepper
     * // => undefined
     *
     * --pepper
     * program.pepper
     * // => true
     *
     * // simple boolean defaulting to true (unless non-negated option is also defined)
     * program.option('-C, --no-cheese', 'remove cheese');
     *
     * program.cheese
     * // => true
     *
     * --no-cheese
     * program.cheese
     * // => false
     *
     * // required argument
     * program.option('-C, --chdir <path>', 'change the working directory');
     *
     * --chdir /tmp
     * program.chdir
     * // => "/tmp"
     *
     * // optional argument
     * program.option('-c, --cheese [type]', 'add cheese [marble]');
     *
     * @param {string} flags
     * @param {string} [description]
     * @param {Function|*} [fn] - custom option processing function or default value
     * @param {*} [defaultValue]
     * @return {Command} `this` command for chaining
     */
    option(flags: string, description?: string | undefined, fn?: Function | any, defaultValue?: any): Command;
    /**
    * Add a required option which must have a value after parsing. This usually means
    * the option must be specified on the command line. (Otherwise the same as .option().)
    *
    * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
    *
    * @param {string} flags
    * @param {string} [description]
    * @param {Function|*} [fn] - custom option processing function or default value
    * @param {*} [defaultValue]
    * @return {Command} `this` command for chaining
    */
    requiredOption(flags: string, description?: string | undefined, fn?: Function | any, defaultValue?: any): Command;
    /**
     * Alter parsing of short flags with optional values.
     *
     * @example
     * // for `.option('-f,--flag [value]'):
     * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
     * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
     *
     * @param {Boolean} [combine=true] - if `true` or omitted, an optional value can be specified directly after the flag.
     */
    combineFlagAndOptionalValue(combine?: boolean | undefined): Command;
    /**
     * Allow unknown options on the command line.
     *
     * @param {Boolean} [allowUnknown=true] - if `true` or omitted, no error will be thrown
     * for unknown options.
     */
    allowUnknownOption(allowUnknown?: boolean | undefined): Command;
    /**
     * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
     *
     * @param {Boolean} [allowExcess=true] - if `true` or omitted, no error will be thrown
     * for excess arguments.
     */
    allowExcessArguments(allowExcess?: boolean | undefined): Command;
    /**
     * Enable positional options. Positional means global options are specified before subcommands which lets
     * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
     * The default behaviour is non-positional and global options may appear anywhere on the command line.
     *
     * @param {Boolean} [positional=true]
     */
    enablePositionalOptions(positional?: boolean | undefined): Command;
    /**
     * Pass through options that come after command-arguments rather than treat them as command-options,
     * so actual command-options come before command-arguments. Turning this on for a subcommand requires
     * positional options to have been enabled on the program (parent commands).
     * The default behaviour is non-positional and options may appear before or after command-arguments.
     *
     * @param {Boolean} [passThrough=true]
     * for unknown options.
     */
    passThroughOptions(passThrough?: boolean | undefined): Command;
    /**
      * Whether to store option values as properties on command object,
      * or store separately (specify false). In both cases the option values can be accessed using .opts().
      *
      * @param {boolean} [storeAsProperties=true]
      * @return {Command} `this` command for chaining
      */
    storeOptionsAsProperties(storeAsProperties?: boolean | undefined): Command;
    /**
     * Retrieve option value.
     *
     * @param {string} key
     * @return {Object} value
     */
    getOptionValue(key: string): any;
    /**
     * Store option value.
     *
     * @param {string} key
     * @param {Object} value
     * @return {Command} `this` command for chaining
     */
    setOptionValue(key: string, value: any): Command;
    /**
      * Store option value and where the value came from.
      *
      * @param {string} key
      * @param {Object} value
      * @param {string} [source] - expected values are default/config/env/cli/implied
      * @return {Command} `this` command for chaining
      */
    setOptionValueWithSource(key: string, value: any, source?: string | undefined): Command;
    /**
      * Get source of option value.
      * Expected values are default | config | env | cli | implied
      *
      * @param {string} key
      * @return {string | undefined}
      */
    getOptionValueSource(key: string): string | undefined;
    /**
      * Get source of option value. See also .optsWithGlobals().
      * Expected values are default | config | env | cli | implied
      *
      * @param {string} key
      * @return {string | undefined}
      */
    getOptionValueSourceWithGlobals(key: string): string | undefined;
    /**
     * Get user arguments from implied or explicit arguments.
     * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
     *
     * @package
     */
    _prepareUserArgs(argv: any, parseOptions: any): any;
    /**
     * Parse `argv`, setting options and invoking commands when defined.
     *
     * The default expectation is that the arguments are from node and have the application as argv[0]
     * and the script being run in argv[1], with user parameters after that.
     *
     * @example
     * program.parse(process.argv);
     * program.parse(); // implicitly use process.argv and auto-detect node vs electron conventions
     * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
     *
     * @param {string[]} [argv] - optional, defaults to process.argv
     * @param {Object} [parseOptions] - optionally specify style of options with from: node/user/electron
     * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
     * @return {Command} `this` command for chaining
     */
    parse(argv?: string[] | undefined, parseOptions?: {
        from?: string | undefined;
    } | undefined): Command;
    /**
     * Parse `argv`, setting options and invoking commands when defined.
     *
     * Use parseAsync instead of parse if any of your action handlers are async. Returns a Promise.
     *
     * The default expectation is that the arguments are from node and have the application as argv[0]
     * and the script being run in argv[1], with user parameters after that.
     *
     * @example
     * await program.parseAsync(process.argv);
     * await program.parseAsync(); // implicitly use process.argv and auto-detect node vs electron conventions
     * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
     *
     * @param {string[]} [argv]
     * @param {Object} [parseOptions]
     * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
     * @return {Promise}
     */
    parseAsync(argv?: string[] | undefined, parseOptions?: {
        from: string;
    } | undefined): Promise<any>;
    /**
     * Execute a sub-command executable.
     *
     * @package
     */
    _executeSubCommand(subcommand: any, args: any): void;
    runningCommand: childProcess.ChildProcess | undefined;
    /**
     * @package
     */
    _dispatchSubcommand(commandName: any, operands: any, unknown: any): void | Promise<any>;
    /**
     * Invoke help directly if possible, or dispatch if necessary.
     * e.g. help foo
     *
     * @package
     */
    _dispatchHelpCommand(subcommandName: any): void | Promise<any>;
    /**
     * Check this.args against expected this._args.
     *
     * @package
     */
    _checkNumberOfArguments(): void;
    /**
     * Process this.args using this._args and save as this.processedArgs!
     *
     * @package
     */
    _processArguments(): void;
    /**
     * Once we have a promise we chain, but call synchronously until then.
     *
     * @param {Promise|undefined} promise
     * @param {Function} fn
     * @return {Promise|undefined}
     * @package
     */
    _chainOrCall(promise: Promise<any> | undefined, fn: Function): Promise<any> | undefined;
    /**
     *
     * @param {Promise|undefined} promise
     * @param {string} event
     * @return {Promise|undefined}
     * @package
     */
    _chainOrCallHooks(promise: Promise<any> | undefined, event: string): Promise<any> | undefined;
    /**
     *
     * @param {Promise|undefined} promise
     * @param {Command} subCommand
     * @param {string} event
     * @return {Promise|undefined}
     * @package
     */
    _chainOrCallSubCommandHook(promise: Promise<any> | undefined, subCommand: Command, event: string): Promise<any> | undefined;
    /**
     * Process arguments in context of this command.
     * Returns action result, in case it is a promise.
     *
     * @package
     */
    _parseCommand(operands: any, unknown: any): void | Promise<any>;
    /**
     * Find matching command.
     *
     * @package
     */
    _findCommand(name: any): Command | undefined;
    /**
     * Return an option matching `arg` if any.
     *
     * @param {string} arg
     * @return {Option | undefined}
     * @package
     */
    _findOption(arg: string): Option | undefined;
    /**
     * Display an error message if a mandatory option does not have a value.
     * Called after checking for help flags in leaf subcommand.
     *
     * @package
     */
    _checkForMissingMandatoryOptions(): void;
    /**
     * Display an error message if conflicting options are used together in this.
     *
     * @package
     */
    _checkForConflictingLocalOptions(): void;
    /**
     * Display an error message if conflicting options are used together.
     * Called after checking for help flags in leaf subcommand.
     *
     * @package
     */
    _checkForConflictingOptions(): void;
    /**
     * Parse options from `argv` removing known options,
     * and return argv split into operands and unknown arguments.
     *
     * Examples:
     *
     *     argv => operands, unknown
     *     --known kkk op => [op], []
     *     op --known kkk => [op], []
     *     sub --unknown uuu op => [sub], [--unknown uuu op]
     *     sub -- --unknown uuu op => [sub --unknown uuu op], []
     *
     * @param {String[]} argv
     * @return {{operands: String[], unknown: String[]}}
     */
    parseOptions(argv: string[]): {
        operands: string[];
        unknown: string[];
    };
    /**
     * Return an object containing local option values as key-value pairs.
     *
     * @return {Object}
     */
    opts(): any;
    /**
     * Return an object containing merged local and global option values as key-value pairs.
     *
     * @return {Object}
     */
    optsWithGlobals(): any;
    /**
     * Display error message and exit (or call exitOverride).
     *
     * @param {string} message
     * @param {Object} [errorOptions]
     * @param {string} [errorOptions.code] - an id string representing the error
     * @param {number} [errorOptions.exitCode] - used with process.exit
     */
    error(message: string, errorOptions?: {
        code?: string | undefined;
        exitCode?: number | undefined;
    } | undefined): void;
    /**
     * Apply any option related environment variables, if option does
     * not have a value from cli or client code.
     *
     * @package
     */
    _parseOptionsEnv(): void;
    /**
     * Apply any implied option values, if option is undefined or default value.
     *
     * @package
     */
    _parseOptionsImplied(): void;
    /**
     * Argument `name` is missing.
     *
     * @param {string} name
     * @package
     */
    missingArgument(name: string): void;
    /**
     * `Option` is missing an argument.
     *
     * @param {Option} option
     * @package
     */
    optionMissingArgument(option: Option): void;
    /**
     * `Option` does not have a value, and is a mandatory option.
     *
     * @param {Option} option
     * @package
     */
    missingMandatoryOptionValue(option: Option): void;
    /**
     * `Option` conflicts with another option.
     *
     * @param {Option} option
     * @param {Option} conflictingOption
     * @package
     */
    _conflictingOption(option: Option, conflictingOption: Option): void;
    /**
     * Unknown option `flag`.
     *
     * @param {string} flag
     * @package
     */
    unknownOption(flag: string): void;
    /**
     * Excess arguments, more than expected.
     *
     * @param {string[]} receivedArgs
     * @package
     */
    _excessArguments(receivedArgs: string[]): void;
    /**
     * Unknown command.
     *
     * @package
     */
    unknownCommand(): void;
    /**
     * Set the program version to `str`.
     *
     * This method auto-registers the "-V, --version" flag
     * which will print the version number when passed.
     *
     * You can optionally supply the  flags and description to override the defaults.
     *
     * @param {string} str
     * @param {string} [flags]
     * @param {string} [description]
     * @return {this | string | undefined} `this` command for chaining, or version string if no arguments
     */
    version(str: string, flags?: string | undefined, description?: string | undefined): string | Command | undefined;
    _version: string | undefined;
    _versionOptionName: string | undefined;
    /**
     * Set the description.
     *
     * @param {string} [str]
     * @param {Object} [argsDescription]
     * @return {string|Command}
     */
    description(str?: string | undefined, argsDescription?: any): string | Command;
    /**
     * Set the summary. Used when listed as subcommand of parent.
     *
     * @param {string} [str]
     * @return {string|Command}
     */
    summary(str?: string | undefined): string | Command;
    /**
     * Set an alias for the command.
     *
     * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
     *
     * @param {string} [alias]
     * @return {string|Command}
     */
    alias(alias?: string | undefined): string | Command;
    /**
     * Set aliases for the command.
     *
     * Only the first alias is shown in the auto-generated help.
     *
     * @param {string[]} [aliases]
     * @return {string[]|Command}
     */
    aliases(aliases?: string[] | undefined): string[] | Command;
    /**
     * Set / get the command usage `str`.
     *
     * @param {string} [str]
     * @return {String|Command}
     */
    usage(str?: string | undefined): string | Command;
    _usage: string | undefined;
    /**
     * Get or set the name of the command.
     *
     * @param {string} [str]
     * @return {string|Command}
     */
    name(str?: string | undefined): string | Command;
    /**
     * Set the name of the command from script filename, such as process.argv[1],
     * or require.main.filename, or __filename.
     *
     * (Used internally and public although not documented in README.)
     *
     * @example
     * program.nameFromFilename(require.main.filename);
     *
     * @param {string} filename
     * @return {Command}
     */
    nameFromFilename(filename: string): Command;
    /**
     * Get or set the directory for searching for executable subcommands of this command.
     *
     * @example
     * program.executableDir(__dirname);
     * // or
     * program.executableDir('subcommands');
     *
     * @param {string} [path]
     * @return {string|null|Command}
     */
    executableDir(path?: string | undefined): string | null | Command;
    /**
     * Return program help documentation.
     *
     * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
     * @return {string}
     */
    helpInformation(contextOptions?: {
        error: boolean;
    } | undefined): string;
    /**
     * @package
     */
    _getHelpContext(contextOptions: any): {
        error: boolean;
    };
    /**
     * Output help information for this command.
     *
     * Outputs built-in help, and custom text added using `.addHelpText()`.
     *
     * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
     */
    outputHelp(contextOptions?: Function | {
        error: boolean;
    } | undefined): void;
    /**
     * You can pass in flags and a description to override the help
     * flags and help description for your command. Pass in false to
     * disable the built-in help option.
     *
     * @param {string | boolean} [flags]
     * @param {string} [description]
     * @return {Command} `this` command for chaining
     */
    helpOption(flags?: string | boolean | undefined, description?: string | undefined): Command;
    /**
     * Output help information and exit.
     *
     * Outputs built-in help, and custom text added using `.addHelpText()`.
     *
     * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
     */
    help(contextOptions?: {
        error: boolean;
    } | undefined): void;
    /**
     * Add additional text to be displayed with the built-in help.
     *
     * Position is 'before' or 'after' to affect just this command,
     * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
     *
     * @param {string} position - before or after built-in help
     * @param {string | Function} text - string to add, or a function returning a string
     * @return {Command} `this` command for chaining
     */
    addHelpText(position: string, text: string | Function): Command;
}
import EventEmitter_1 = require("events");
import EventEmitter = EventEmitter_1.EventEmitter;
import { Option } from "./option.js";
import { Argument } from "./argument.js";
import { Help } from "./help.js";
import childProcess = require("child_process");
//# sourceMappingURL=command.d.ts.map