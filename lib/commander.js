
/*!
 * commander
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , path = require('path')
  , basename = path.basename;

/**
 * Expose the root command.
 */

exports = module.exports = new Command;

/**
 * Expose `Command`.
 */

exports.Command = Command;

function Option(flags, description) {
  this.flags = flags;
  this.required = ~flags.indexOf('<');
  this.optional = ~flags.indexOf('[');
  this.bool = !~flags.indexOf('-no-');
  flags = flags.split(/[ ,|]+/)
  this.small = flags.shift();
  this.large = flags.shift();
  this.description = description;
}

Option.prototype.name = function(){
  return this.large
    .replace('--', '')
    .replace('no-', '');
};

Option.prototype.is = function(arg){
  return arg == this.small
    || arg == this.large;
};


/**
 * Initialize a new `Command`.
 *
 * @param {String} name
 * @api public
 */

function Command(name) {
  this.commands = [];
  this.options = [];
  this.args = [];
  this.name = name;
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Command.prototype.__proto__ = EventEmitter.prototype;

Command.prototype.command = function(name){
  var args = name.split(/ +/);
  var cmd = new Command(args.shift());
  this.commands.push(cmd);
  cmd.arg(args);
  cmd.parent = this;
  return cmd;
};

Command.prototype.arg = function(args){
  if (!args.length) return;
  var self = this;
  args.forEach(function(arg){
    switch (arg[0]) {
      case '<':
        self.args.push({ required: true, name: arg.slice(1, -1) });
        break;
      case '[':
        self.args.push({ required: false, name: arg.slice(1, -1) });
        break;
    }
  });
  return this;
};

Command.prototype.action = function(fn){
  var self = this;
  this.parent.on(this.name, function(args){
    self.args.forEach(function(arg, i){
      if (null == args[i]) {
        self.missingArgument(arg.name);
      }
    });
    fn.apply(this, args);
  });
  return this;
};

Command.prototype.option = function(flags, description, fn){
  var self = this
    , option = new Option(flags, description)
    , name = option.name();

  // when --no-* we default to true
  if (false == option.bool) self[name] = true;

  // register the option
  this.options.push(option);

  // when it's passed assign the value
  // and conditionally invoke the callback
  this.on(name, function(val){
    // coercion
    if (null != val && fn) val = fn(val);

    // assign value
    self[name] = null == val
      ? option.bool
      : val;
  });

  return this;
};

Command.prototype.parse = function(argv){
  // store raw args
  this.rawArgs = argv;

  // guess name
  if (!this.name) this.name = basename(argv[1]);

  // default options
  this.option('-h, --help', 'output usage information');
  this.on('help', function(){
    process.stdout.write(this.helpInformation());
    process.exit(0);
  });

  // process argv
  return this.parseArgs(this.parseOptions(this.normalize(argv)));
};

Command.prototype.normalize = function(args){
  var ret = []
    , arg;

  for (var i = 0, len = args.length; i < len; ++i) {
    arg = args[i];
    if (arg.length > 1 && '-' == arg[0] && '-' != arg[1]) {
      arg.slice(1).split('').forEach(function(c){
        ret.push('-' + c);
      });
    } else {
      ret.push(arg);
    }
  }

  return ret;
};

Command.prototype.parseArgs = function(args){
  var cmds = this.commands
    , len = cmds.length;

  if (args.length) {
    this.emit('*', args);
    this.emit(arg = args.shift(), args);
  }

  return this;
};

Command.prototype.optionFor = function(arg){
  for (var i = 0, len = this.options.length; i < len; ++i) {
    if (this.options[i].is(arg)) {
      return this.options[i];
    }
  }
};

Command.prototype.parseOptions = function(argv){
  var args = []
    , argv = argv.slice(2)
    , len = argv.length
    , option
    , arg;

  // parse options
  for (var i = 0; i < len; ++i) {
    arg = argv[i];
    option = this.optionFor(arg);

    // option is defined
    if (option) {
      // requires arg
      if (option.required) {
        arg = argv[++i];
        if (null == arg) return this.optionMissingArgument(option);
        if ('-' == arg[0]) return this.optionMissingArgument(option, arg);
        this.emit(option.name(), arg);
      // optional arg
      } else if (option.optional) {
        arg = argv[i+1];
        if (null == arg || '-' == arg[0]) {
          arg = null;
        } else {
          ++i;
        }
        this.emit(option.name(), arg);
      // bool
      } else {
        this.emit(option.name());
      }
      continue;
    }
    
    // looks like an option
    if (arg.length > 1 && '-' == arg[0]) {
      this.unknownOption(arg);
    }
    
    // arg
    args.push(arg);
  }

  return args;
};

Command.prototype.missingArgument = function(name){
  console.error();
  console.error("  error: missing required argument `%s'", name);
  console.error();
  process.exit(1);
};

Command.prototype.optionMissingArgument = function(option, got){
  console.error();
  if (got) {
    console.error("  error: option `%s' argument missing, got `%s'", option.flags, got);
  } else {
    console.error("  error: option `%s' argument missing", option.flags);
  }
  console.error();
  process.exit(1);
};


Command.prototype.unknownOption = function(flag){
  console.error();
  console.error("  error: unknown option `%s'", flag);
  console.error();
  process.exit(1);
};

Command.prototype.version = function(str){
  if (0 == arguments.length) return this._version;
  this._version = str;
  this.option('-v, --version', 'output the version number');
  this.on('version', function(){
    console.log(str);
    process.exit(0);
  });
  return this;
};

Command.prototype.usage = function(str){
  if (0 == arguments.length) return this._usage || '[options]';
  this._usage = str;
  return this;
};

Command.prototype.largestOptionLength = function(){
  return this.options.reduce(function(max, option){
    return Math.max(max, option.flags.length);
  }, 0);
};

Command.prototype.optionHelp = function(){
  var width = this.largestOptionLength();
  return this.options.map(function(option){
    return pad(option.flags, width)
      + '  ' + option.description;
  }).join('\n');
};

Command.prototype.commandHelp = function(){
  if (!this.commands.length) return '';
  return [
      ''
    , '  Commands:'
    , ''
    , this.commands.map(function(cmd){
      var args = cmd.args.map(function(arg){
        return arg.required
          ? '<' + arg.name + '>'
          : '[' + arg.name + ']';
      }).join(' ');
      return cmd.name + ' ' + args + '\n' + cmd.description();
    }).join('\n\n').replace(/^/gm, '    ')
    , ''
  ].join('\n');
};


Command.prototype.helpInformation = function(){
  return [
      ''
    , '  Usage: ' + this.name + ' ' + this.usage()
    , '' + this.commandHelp()
    , '  Options:'
    , ''
    , '' + this.optionHelp().replace(/^/gm, '    ')
    , ''
    , ''
  ].join('\n');
};

Command.prototype.promptForNumber = function(str, fn){
  this.promptSingleLine(str, function(val){
    val = Number(val);
    if (isNaN(val)) return program.promptForNumber(str + '(must be a number) ', fn);
    fn(val);
  });
};

Command.prototype.promptForDate = function(str, fn){
  this.promptSingleLine(str, function(val){
    val = new Date(val);
    if (isNaN(val.getTime())) return program.promptForDate(str + '(must be a date) ', fn);
    fn(val);
  });
};

Command.prototype.promptSingleLine = function(str, fn){
  if ('function' == typeof arguments[2]) {
    return this['promptFor' + (fn.name || fn)](str, arguments[2]);
  }

  process.stdout.write(str);
  process.stdin.setEncoding('utf8');
  process.stdin.once('data', function(val){
    fn(val);
  }).resume();
};

Command.prototype.promptMultiLine = function(str, fn){
  var buf = '';
  console.log(str);
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function(val){
    if ('\n' == val) {
      process.stdin.removeAllListeners('data');
      fn(buf);
    } else {
      buf += val;
    }
  }).resume();
};

Command.prototype.prompt = function(str, fn){
  if (/ $/.test(str)) return this.promptSingleLine.apply(this, arguments);
  this.promptMultiLine(str, fn);
};

Command.prototype.confirm = function(str, fn){
  this.prompt(str, function(ok){
    fn(parseBool(ok));
  });
};

Command.prototype.choose = function(list, fn){
  var self = this;

  list.forEach(function(item, i){
    console.log('  %d) %s', i + 1, item);
  });

  function again() {
    self.prompt('  : ', function(val){
      val = parseInt(val, 10) - 1;
      if (null == list[val]) {
        again();
      } else {
        fn(val, list[val]);
      }
    });
  }

  again();
};

function parseBool(str) {
  return /^y|yes|ok|true$/i.test(str);
}

function pad(str, width) {
  var len = Math.max(0, width - str.length);
  return str + Array(len + 1).join(' ');
}