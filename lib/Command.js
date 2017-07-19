const fs = require('fs');
const EventEmitter = require('events');
const spawn = require('child_process').spawn;
const {
  dirname,
  basename,
  join,
} = require('path');
const Option = require('./Option.js');

const SIGNALS = [
  'SIGUSR1',
  'SIGUSR2',
  'SIGTERM',
  'SIGINT',
  'SIGHUP',
];

/**
 * Camel-case the given `flag`.
 *
 * @param {string} flag
 * @returns {string}
 */
function camelcase(flag) {
  return flag
    .split('-')
    .reduce((str, word) => str + word[0].toUpperCase() + word.slice(1));
}

/**
 * Pad `str` to `width`.
 *
 * @param {string} str
 * @param {number} width
 * @returns {string}
 */
function pad(str, width) {
  const len = Math.max(0, width - str.length) + 1;

  return str + Array(len).join(' ');
}

/**
 * Output help information if necessary
 *
 * @param {Command} cmd Command to output help for
 * @param {Array=} [options = []] Array of options to search for -h or --help
 * @returns {void}
 */
function outputHelpIfNecessary(cmd, options = []) {
  for (let i = 0; i < options.length; i++) {
    if (options[i] === '--help' || options[i] === '-h') {
      cmd.outputHelp();
      process.exit(0);
    }
  }
}

/**
 * Takes an argument an returns its human readable equivalent for help usage.
 *
 * @param {Object} arg
 * @returns {string}
 */
function humanReadableArgName(arg) {
  const nameOutput = arg.name + (arg.variadic ? '...' : '');

  return arg.required ?
    `<${nameOutput}>` :
    `[${nameOutput}]`;
}

/**
 * Test whether `file` is exists.
 *
 * @param {string} file
 * @returns {boolean} `true` if exists; otherwise `false`
 */
function exists(file) {
  try {
    if (fs.statSync(file).isFile()) {
      return true;
    }
  } catch (_) { /* ... */ }

  return false;
}

/**
 * Command.
 */
class Command extends EventEmitter {
  /**
   * @param {string} name
   */
  constructor(name) {
    super();

    this.commands = [];
    this.options = [];
    this._execs = {};
    this._allowUnknownOption = false;
    this._args = [];
    this._name = name || '';
  }

  /**
   * Add command `name`.
   *
   * The `.action()` callback is invoked when the
   * command `name` is specified via __ARGV__,
   * and the remaining arguments are applied to the
   * function for access.
   *
   * When the `name` is "*" an un-matched command
   * will be passed as the first arg, followed by
   * the rest of __ARGV__ remaining.
   *
   * Examples:
   *
   *      program
   *        .version('0.0.1')
   *        .option('-C, --chdir <path>', 'change the working directory')
   *        .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
   *        .option('-T, --no-tests', 'ignore test hook')
   *
   *      program
   *        .command('setup')
   *        .description('run remote setup commands')
   *        .action(function() {
   *          console.log('setup');
   *        });
   *
   *      program
   *        .command('exec <cmd>')
   *        .description('run the given remote command')
   *        .action(function(cmd) {
   *          console.log('exec "%s"', cmd);
   *        });
   *
   *      program
   *        .command('teardown <dir> [otherDirs...]')
   *        .description('run teardown commands')
   *        .action(function(dir, otherDirs) {
   *          console.log('dir "%s"', dir);
   *          if (otherDirs) {
   *            otherDirs.forEach(function (oDir) {
   *              console.log('dir "%s"', oDir);
   *            });
   *          }
   *        });
   *
   *      program
   *        .command('*')
   *        .description('deploy the given env')
   *        .action(function(env) {
   *          console.log('deploying "%s"', env);
   *        });
   *
   *      program.parse(process.argv);
   *
   * @param {string} name
   * @param {string} [desc] for git-style sub-commands
   * @returns {Command} the new command
   */
  command(name, desc, opts = {}) {
    const args = name.split(/ +/);
    const cmd = new Command(args.shift());

    if (desc) {
      cmd.description(desc);
      this.executables = true;
      this._execs[cmd._name] = true;
      if (opts.isDefault) this.defaultExecutable = cmd._name;
    }

    cmd._noHelp = !!opts.noHelp;
    this.commands.push(cmd);
    cmd.parseExpectedArgs(args);
    cmd.parent = this;

    if (desc) {
      return this;
    }

    return cmd;
  }

  /**
   * Define argument syntax for the top-level command.
   *
   * @param {string} desc
   * @returns {Command} for chaining
   */
  arguments(desc) {
    return this.parseExpectedArgs(desc.split(/ +/));
  }

  /**
   * Add an implicit `help [cmd]` subcommand
   * which invokes `--help` for the given command.
   *
   * @private
   */
  addImplicitHelpCommand() {
    this.command('help [cmd]', 'display help for [cmd]');
  }

  /**
   * Parse expected `args`.
   *
   * For example `["[type]"]` becomes `[{ required: false, name: 'type' }]`.
   *
   * @param {Array} args
   * @returns {Command} for chaining
   */
  parseExpectedArgs(args) {
    if (!args.length) {
      return null;
    }

    args.forEach((arg) => {
      const argDetails = {
        required: false,
        name: '',
        variadic: false,
      };

      switch (arg[0]) {
        case '<':
          argDetails.required = true;
          argDetails.name = arg.slice(1, -1);
          break;
        case '[':
          argDetails.name = arg.slice(1, -1);
          break;
      }

      if (argDetails.name.length > 3 && argDetails.name.slice(-3) === '...') {
        argDetails.variadic = true;
        argDetails.name = argDetails.name.slice(0, -3);
      }

      if (argDetails.name) {
        this._args.push(argDetails);
      }
    });

    return this;
  }

  /**
   * Register callback `fn` for the command.
   *
   * Examples:
   *
   *      program
   *        .command('help')
   *        .description('display verbose help')
   *        .action(function() {
   *           // output help here
   *        });
   *
   * @param {Function} fn
   * @returns {Command} for chaining
   */
  action(fn) {
    const listener = (args = [], unknown = []) => {
      const parsed = this.parseOptions(unknown);

      // Output help if necessary
      outputHelpIfNecessary(this, parsed.unknown);

      // If there are still any unknown options, then we simply
      // die, unless someone asked for help, in which case we give it
      // to them, and then we die.
      if (parsed.unknown.length > 0) {
        this.unknownOption(parsed.unknown[0]);
      }

      // Leftover arguments need to be pushed back. Fixes issue #56
      if (parsed.args.length) {
        args = parsed.args.concat(args);
      }

      this._args.forEach((arg, i) => {
        if (arg.required && args[i] === null) {
          this.missingArgument(arg.name);
        } else if (arg.variadic) {
          if (i !== this._args.length - 1) {
            this.variadicArgNotLast(arg.name);
          }

          args[i] = args.splice(i);
        }
      });

      // Always append ourselves to the end of the arguments,
      // to make sure we match the number of arguments the user
      // expects
      if (this._args.length) {
        args[this._args.length] = this;
      } else {
        args.push(this);
      }

      fn.apply(this, args);
    };
    const parent = this.parent || this;
    const name = parent === this ? '*' : this._name;
    parent.on(`command:${name}`, listener);

    if (this._alias) {
      parent.on(`command:${this._alias}`, listener);
    }

    return this;
  }

  /**
   * Define option with `flags`, `description` and optional
   * coercion `fn`.
   *
   * The `flags` string should contain both the short and long flags,
   * separated by comma, a pipe or space. The following are all valid
   * all will output this way when `--help` is used.
   *
   *    "-p, --pepper"
   *    "-p|--pepper"
   *    "-p --pepper"
   *
   * Examples:
   *
   *     // simple boolean defaulting to false
   *     program.option('-p, --pepper', 'add pepper');
   *
   *     --pepper
   *     program.pepper
   *     // => Boolean
   *
   *     // simple boolean defaulting to true
   *     program.option('-C, --no-cheese', 'remove cheese');
   *
   *     program.cheese
   *     // => true
   *
   *     --no-cheese
   *     program.cheese
   *     // => false
   *
   *     // required argument
   *     program.option('-C, --chdir <path>', 'change the working directory');
   *
   *     --chdir /tmp
   *     program.chdir
   *     // => "/tmp"
   *
   *     // optional argument
   *     program.option('-c, --cheese [type]', 'add cheese [marble]');
   *
   * @param {string} flags
   * @param {string} description
   * @param {Function|*} [fn] or default
   * @param {*} [defaultValue]
   * @returns {Command} for chaining
   */
  option(flags, description, fn, defaultValue) {
    const option = new Option(flags, description);
    const oname = option.name();
    const name = camelcase(oname);

    // default as 3rd arg
    if (typeof fn !== 'function') {
      if (fn instanceof RegExp) {
        const regex = fn;
        fn = (val, def) => {
          const m = regex.exec(val);
          return m ? m[0] : def;
        };
      } else {
        defaultValue = fn;
        fn = null;
      }
    }

    // preassign default value only for --no-*, [optional], or <required>
    if (option.bool === false || option.optional || option.required) {
      // when --no-* we make sure default is true
      if (option.bool === false) defaultValue = true;
      // preassign only if we have a default
      if (defaultValue !== undefined) this[name] = defaultValue;
    }

    // register the option
    this.options.push(option);

    // when it's passed assign the value
    // and conditionally invoke the callback
    this.on(`option:${oname}`, (val) => {
      // coercion
      if (val !== null && fn) {
        val = fn(
          val,
          this[name] === undefined ?
            defaultValue :
            this[name],
        );
      }

      // unassigned or bool
      if (typeof this[name] === 'boolean' || typeof this[name] === 'undefined') {
        // if no value, bool true, and we have a default, then use it!
        if (val === null) {
          this[name] = option.bool
            ? defaultValue || true
            : false;
        } else {
          this[name] = val;
        }
      } else if (val !== null) {
        // reassign
        this[name] = val;
      }
    });

    return this;
  }

  /**
   * Allow unknown options on the command line.
   *
   * @param {Boolean} arg if `true` or omitted, no error will be thrown
   * for unknown options.
   */
  allowUnknownOption(arg) {
    this._allowUnknownOption = arguments.length === 0 || arg;

    return this;
  }

  /**
   * Parse `argv`, settings options and invoking commands when defined.
   *
   * @param {Array} argv
   * @returns {Command} for chaining
   */
  parse(argv) {
    // implicit help
    if (this.executables) this.addImplicitHelpCommand();

    // store raw args
    this.rawArgs = argv;

    // guess name
    this._name = this._name || basename(argv[1], '.js');

    // github-style sub-commands with no sub-command
    if (this.executables && argv.length < 3 && !this.defaultExecutable) {
      // this user needs help
      argv.push('--help');
    }

    // process argv
    const parsed = this.parseOptions(this.normalize(argv.slice(2)));

    this.args = parsed.args;

    const args = this.args;
    const result = this.parseArgs(this.args, parsed.unknown);

    // executable sub-commands
    const name = result.args[0];

    let aliasCommand = null;
    // check alias of sub commands
    if (name) {
      aliasCommand = this.commands.filter(cmd => cmd.alias() === name)[0];
    }

    if (this._execs[name] && typeof this._execs[name] !== 'function') {
      return this.executeSubCommand(argv, args, parsed.unknown);
    } else if (aliasCommand) {
      // is alias of a subCommand
      args[0] = aliasCommand._name;
      return this.executeSubCommand(argv, args, parsed.unknown);
    } else if (this.defaultExecutable) {
      // use the default subcommand
      args.unshift(this.defaultExecutable);
      return this.executeSubCommand(argv, args, parsed.unknown);
    }

    return result;
  }

  /**
   * Execute a sub-command executable.
   *
   * @param {Array} argv
   * @param {Array} args
   * @param {Array} unknown
   * @private
   */
  executeSubCommand(argv, args, unknown) {
    args = args.concat(unknown);

    if (!args.length) this.help();
    if (args[0] === 'help' && args.length === 1) this.help();

    // <cmd> --help
    if (args[0] === 'help') {
      args[0] = args[1];
      args[1] = '--help';
    }

    // executable
    const f = argv[1];
    // name of the subcommand, link `pm-install`
    let bin = `${basename(f, '.js')}-${args[0]}`;

    // In case of globally installed, get the base dir where executable
    //  subcommand file should be located at
    let link = fs.lstatSync(f).isSymbolicLink() ? fs.readlinkSync(f) : f;

    // when symbolink is relative path
    if (link !== f && link.charAt(0) !== '/') {
      link = join(dirname(f), link);
    }

    const baseDir = dirname(link);

    // prefer local `./<bin>` to bin in the $PATH
    const localBin = join(baseDir, bin);

    // whether bin file is a js script with explicit `.js` extension
    let isExplicitJS = false;
    if (exists(`${localBin}.js`)) {
      bin = `${localBin}.js`;
      isExplicitJS = true;
    } else if (exists(localBin)) {
      bin = localBin;
    }

    args = args.slice(1);

    let proc;
    if (process.platform !== 'win32') {
      if (isExplicitJS) {
        args.unshift(bin);

        // add executable arguments to spawn
        args = (process.execArgv || []).concat(args);
        proc = spawn(process.argv[0], args, { stdio: 'inherit', customFds: [0, 1, 2] });
      } else {
        proc = spawn(bin, args, { stdio: 'inherit', customFds: [0, 1, 2] });
      }
    } else {
      args.unshift(bin);

      proc = spawn(process.execPath, args, { stdio: 'inherit' });
    }

    SIGNALS.forEach((signal) => {
      process.on(signal, () => {
        if (proc.killed === false && proc.exitCode === null) {
          proc.kill(signal);
        }
      });
    });
    proc.on('close', process.exit.bind(process));
    proc.on('error', (err) => {
      if (err.code === 'ENOENT') {
        console.error(`\n  ${bin}(1) does not exist, try --help\n`);
      } else if (err.code === 'EACCES') {
        console.error(`\n  ${bin}(1) not executable. try chmod or run with root\n`);
      }

      process.exit(1);
    });

    // Store the reference to the child process
    this.runningCommand = proc;
  }

  /**
   * Normalize `args`, splitting joined short flags. For example
   * the arg "-abc" is equivalent to "-a -b -c".
   * This also normalizes equal sign and splits "--abc=def" into "--abc def".
   *
   * @param {Array} args
   * @returns {Array}
   * @private
   */
  normalize(args) {
    const len = args.length;
    let ret = [];

    for (let i = 0; i < len; ++i) {
      const arg = args[i];
      const index = arg.indexOf('=');
      let lastOpt;

      if (i > 0) {
        lastOpt = this.optionFor(args[i - 1]);
      }

      if (arg === '--') {
        // Honor option terminator
        ret = ret.concat(args.slice(i));
        break;
      } else if (lastOpt && lastOpt.required) {
        ret.push(arg);
      } else if (arg.length > 1 && arg[0] === '-' && arg[1] !== '-') {
        /* eslint-disable no-loop-func */

        arg
          .slice(1)
          .split('')
          .forEach(c => ret.push(`-${c}`));

        /* eslint-enable no-loop-func */
      } else if (/^--/.test(arg) && ~index) {
        ret.push(arg.slice(0, index), arg.slice(index + 1));
      } else {
        ret.push(arg);
      }
    }

    return ret;
  }

  /**
   * Parse command `args`.
   *
   * When listener(s) are available those
   * callbacks are invoked, otherwise the "*"
   * event is emitted and those actions are invoked.
   *
   * @param {Array} args
   * @returns {Command} for chaining
   * @private
   */
  parseArgs(args, unknown) {
    let name;

    if (args.length) {
      name = args[0];
      if (this.listeners(`command:${name}`).length) {
        this.emit(`command:${args.shift()}`, args, unknown);
      } else {
        this.emit('command:*', args);
      }
    } else {
      outputHelpIfNecessary(this, unknown);

      // If there were no args and we have unknown options,
      // then they are extraneous and we need to error.
      if (unknown.length > 0) {
        this.unknownOption(unknown[0]);
      }
    }

    return this;
  }

  /**
   * Return an option matching `arg` if any.
   *
   * @param {string} arg
   * @returns {Option}
   * @private
   */
  optionFor(arg) {
    for (let i = 0, len = this.options.length; i < len; ++i) {
      if (this.options[i].is(arg)) {
        return this.options[i];
      }
    }

    return null;
  }

  /**
   * Parse options from `argv` returning `argv`
   * void of these options.
   *
   * @param {Array} argv
   * @returns {Array}
   */
  parseOptions(argv) {
    const args = [];
    const len = argv.length;
    const unknownOptions = [];
    let literal;
    let option;
    let arg;

    // parse options
    for (let i = 0; i < len; ++i) {
      arg = argv[i];

      // literal args after --
      if (literal) {
        args.push(arg);
        continue;
      }

      if (arg === '--') {
        literal = true;
        continue;
      }

      // find matching Option
      option = this.optionFor(arg);

      // option is defined
      if (option) {
        // requires arg
        if (option.required) {
          arg = argv[++i];
          if (arg === null) return this.optionMissingArgument(option);
          this.emit(`option:${option.name()}`, arg);
        // optional arg
        } else if (option.optional) {
          arg = argv[i + 1];
          if (arg === null || (arg[0] === '-' && arg !== '-')) {
            arg = null;
          } else {
            ++i;
          }
          this.emit(`option:${option.name()}`, arg);
        // bool
        } else {
          this.emit(`option:${option.name()}`);
        }
        continue;
      }

      // looks like an option
      if (arg.length > 1 && arg[0] === '-') {
        unknownOptions.push(arg);

        // If the next argument looks like it might be
        // an argument for this option, we pass it on.
        // If it isn't, then it'll simply be ignored
        if (argv[i + 1] && argv[i + 1][0] !== '-') {
          unknownOptions.push(argv[++i]);
        }
        continue;
      }

      // arg
      args.push(arg);
    }

    return {
      args,
      unknown: unknownOptions,
    };
  }

  /**
   * Return an object containing options as key-value pairs
   *
   * @returns {Object}
   */
  opts() {
    const result = {};
    const len = this.options.length;

    for (let i = 0; i < len; i++) {
      const key = camelcase(this.options[i].name());
      result[key] = key === 'version' ? this._version : this[key];
    }

    return result;
  }

  /**
   * Argument `name` is missing.
   *
   * @param {string} name
   * @private
   */
  missingArgument(name) {
    console.error();
    console.error(`  error: missing required argument \`${name}'`);
    console.error();
    process.exit(1);
  }

  /**
   * `Option` is missing an argument, but received `flag` or nothing.
   *
   * @param {string} option
   * @param {string} flag
   * @private
   */
  optionMissingArgument(option, flag) {
    console.error();

    if (flag) {
      console.error(`  error: option \`${option.flags}' argument missing, got \`${flag}'`);
    } else {
      console.error(`  error: option \`${option.flags}' argument missing`);
    }

    console.error();
    process.exit(1);
  }

  /**
   * Unknown option `flag`.
   *
   * @param {string} flag
   * @private
   */
  unknownOption(flag) {
    if (this._allowUnknownOption) return;

    console.error();
    console.error(`  error: unknown option \`${flag}'`);
    console.error();
    process.exit(1);
  }

  /**
   * Variadic argument with `name` is not the last argument as required.
   *
   * @param {string} name
   * @private
   */
  variadicArgNotLast(name) {
    console.error();
    console.error(`  error: variadic arguments must be last \`${name}'`);
    console.error();
    process.exit(1);
  }

  /**
   * Set the program version to `str`.
   *
   * This method auto-registers the "-V, --version" flag
   * which will print the version number when passed.
   *
   * @param {string} str
   * @param {string} [flags]
   * @returns {Command} for chaining
   */
  version(str, flags) {
    if (arguments.length === 0) return this._version;
    this._version = str;
    flags = flags || '-V, --version';
    this.option(flags, 'output the version number');
    this.on('option:version', () => {
      process.stdout.write(`${str}\n`);
      process.exit(0);
    });

    return this;
  }

  /**
   * Set the description to `str`.
   *
   * @param {string} str
   * @returns {string|Command}
   */
  description(str) {
    if (arguments.length === 0) return this._description;
    this._description = str;

    return this;
  }

  /**
   * Set an alias for the command
   *
   * @param {string} alias
   * @returns {string|Command}
   */
  alias(alias) {
    let command = this;

    if (this.commands.length !== 0) {
      command = this.commands[this.commands.length - 1];
    }

    if (arguments.length === 0) return command._alias;

    command._alias = alias;

    return this;
  }

  /**
   * Set / get the command usage `str`.
   *
   * @param {string} str
   * @returns {string|Command}
   */
  usage(str) {
    const args = this._args.map(arg => humanReadableArgName(arg));

    const usage = `[options]${
      this.commands.length ? ' [command]' : ''
    }${this._args.length ? ` ${args.join(' ')}` : ''}`;

    if (arguments.length === 0) {
      return this._usage || usage;
    }

    this._usage = str;

    return this;
  }

  /**
   * Get or set the name of the command
   *
   * @param {string} str
   * @returns {string|Command}
   */
  name(str) {
    if (arguments.length === 0) return this._name;
    this._name = str;

    return this;
  }

  /**
   * Return the largest option length.
   *
   * @returns {number}
   * @private
   */
  largestOptionLength() {
    return this.options.reduce((max, option) => Math.max(max, option.flags.length), 0);
  }

  /**
   * Return help for options.
   *
   * @returns {string}
   * @private
   */
  optionHelp() {
    const width = this.largestOptionLength();

    // Append the help information
    return this.options
      .map(option => `${pad(option.flags, width)}  ${option.description}`)
      .concat([`${pad('-h, --help', width)}  output usage information`])
      .join('\n');
  }

  /**
   * Return command help documentation.
   *
   * @returns {string}
   * @private
   */
  commandHelp() {
    if (!this.commands.length) return '';

    const commands = this.commands
      .filter(cmd => !cmd._noHelp)
      .map((cmd) => {
        const args = cmd._args.map(arg => humanReadableArgName(arg)).join(' ');

        return [
          `${cmd._name +
            (cmd._alias ? `|${cmd._alias}` : '') +
            (cmd.options.length ? ' [options]' : '')
          } ${args}`,
          cmd._description,
        ];
      });

    const width = commands.reduce((max, cmd) => Math.max(max, cmd[0].length), 0);

    return [
      '',
      '  Commands:',
      '',

      commands.map((cmd) => {
        const desc = cmd[1] ? `  ${cmd[1]}` : '';
        return pad(cmd[0], width) + desc;
      }).join('\n').replace(/^/gm, '    '),

      '',
    ].join('\n');
  }

  /**
   * Return program help documentation.
   *
   * @returns {string}
   * @private
   */
  helpInformation() {
    let desc = [];

    if (this._description) {
      desc = [
        `  ${this._description}`,
        '',
      ];
    }

    let cmdName = this._name;

    if (this._alias) {
      cmdName = `${cmdName}|${this._alias}`;
    }

    const usage = [
      '',
      `  Usage: ${cmdName} ${this.usage()}`,
      '',
    ];
    const commandHelp = this.commandHelp();
    let cmds = [];

    if (commandHelp) {
      cmds = [commandHelp];
    }

    const options = [
      '',
      '  Options:',
      '',
      `${this.optionHelp().replace(/^/gm, '    ')}`,
      '',
    ];

    return usage
      .concat(desc)
      .concat(options)
      .concat(cmds)
      .join('\n');
  }

  /**
   * Output help information for this command
   */

  outputHelp(cb = passthru => passthru) {
    process.stdout.write(cb(this.helpInformation()));
    this.emit('--help');
  }

  /**
   * Output help information and exit.
   */

  help(cb) {
    this.outputHelp(cb);
    process.exit();
  }
}

module.exports = Command;
