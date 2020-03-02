
const fs = require('fs');

/**
 * Pad `str` to `width`.
 *
 * @param {String} str
 * @param {Number} width
 * @return {String}
 * @api private
 */

function pad(str, width) {
  const len = Math.max(0, width - str.length);
  return str + Array(len + 1).join(' ');
}

/**
 * Wraps the given string with line breaks at the specified width while breaking
 * words and indenting every but the first line on the left.
 *
 * @param {String} str
 * @param {Number} width
 * @param {Number} indent
 * @return {String}
 * @api private
 */
function wrap(str, width, indent) {
  const regex = new RegExp('.{1,' + (width - 1) + '}([\\s\u200B]|$)|[^\\s\u200B]+?([\\s\u200B]|$)', 'g');
  const lines = str.match(regex) || [];
  return lines.map((line, i) => {
    if (line.slice(-1) === '\n') {
      line = line.slice(0, line.length - 1);
    }
    return ((i > 0 && indent) ? Array(indent + 1).join(' ') : '') + line.trimRight();
  }).join('\n');
}

/**
 * Optionally wrap the given str to a max width of width characters per line
 * while indenting with indent spaces. Do not wrap if insufficient width or
 * string is manually formatted.
 *
 * @param {String} str
 * @param {Number} width
 * @param {Number} indent
 * @return {String}
 * @api private
 */
function optionalWrap(str, width, indent) {
  // Detect manually wrapped and indented strings by searching for line breaks
  // followed by multiple spaces/tabs.
  if (str.match(/[\n]\s+/)) return str;
  // Do not wrap to narrow columns (or can end up with a word per line).
  const minWidth = 40;
  if (width < minWidth) return str;

  return wrap(str, width, indent);
}

/**
 * Output help information if help flags specified
 *
 * @param {Command} cmd - command to output help for
 * @param {Array} options - array of options to search for -h or --help
 * @api private
 */

function outputHelpIfRequested(cmd, options) {
  options = options || [];

  for (let i = 0; i < options.length; i++) {
    if (options[i] === cmd._helpLongFlag || options[i] === cmd._helpShortFlag) {
      cmd.outputHelp();
      // (Do not have all displayed text available so only passing placeholder.)
      cmd._exit(0, 'commander.helpDisplayed', '(outputHelp)');
    }
  }
}

/**
 * Takes an argument and returns its human readable equivalent for help usage.
 *
 * @param {Object} arg
 * @return {String}
 * @api private
 */

function humanReadableArgName(arg) {
  const nameOutput = arg.name + (arg.variadic === true ? '...' : '');

  return arg.required ? '<' + nameOutput + '>' : '[' + nameOutput + ']';
}

// for versions before node v0.8 when there weren't `fs.existsSync`
function exists(file) {
  try {
    if (fs.statSync(file).isFile()) {
      return true;
    }
  } catch (e) {
    return false;
  }
}

/**
 * Scan arguments and increment port number for inspect calls (to avoid conflicts when spawning new command).
 *
 * @param {string[]} args - array of arguments from node.execArgv
 * @returns {string[]}
 * @api private
 */

function incrementNodeInspectorPort(args) {
  // Testing for these options:
  //  --inspect[=[host:]port]
  //  --inspect-brk[=[host:]port]
  //  --inspect-port=[host:]port
  return args.map((arg) => {
    let result = arg;
    if (arg.indexOf('--inspect') === 0) {
      let debugOption;
      let debugHost = '127.0.0.1';
      let debugPort = '9229';
      let match;
      if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
        // e.g. --inspect
        debugOption = match[1];
      } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
        debugOption = match[1];
        if (/^\d+$/.test(match[3])) {
          // e.g. --inspect=1234
          debugPort = match[3];
        } else {
          // e.g. --inspect=localhost
          debugHost = match[3];
        }
      } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
        // e.g. --inspect=localhost:1234
        debugOption = match[1];
        debugHost = match[3];
        debugPort = match[4];
      }

      if (debugOption && debugPort !== '0') {
        result = `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
      }
    }
    return result;
  });
}
module.exports = { pad, wrap, optionalWrap, outputHelpIfRequested, humanReadableArgName, exists, incrementNodeInspectorPort };
