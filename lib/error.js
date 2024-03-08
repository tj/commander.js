/**
 * CommanderError class
 *
 * @class
 */
class CommanderError extends Error {
  /**
   * Constructs the CommanderError class
   *
   * @class
   * @param {number} exitCode Suggested exit code which could be used with
   *   process.exit
   * @param {string} code An id string representing the error
   * @param {string} message Human-readable description of the error
   */
  constructor(exitCode, code, message) {
    super(message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = code;
    this.exitCode = exitCode;
    this.nestedError = undefined;
  }
}

/**
 * InvalidArgumentError class
 *
 * @class
 */
class InvalidArgumentError extends CommanderError {
  /**
   * Constructs the InvalidArgumentError class
   *
   * @class
   * @param {string} [message] Explanation of why argument is invalid
   */
  constructor(message) {
    super(1, 'commander.invalidArgument', message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

exports.CommanderError = CommanderError;
exports.InvalidArgumentError = InvalidArgumentError;
