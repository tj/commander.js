// @ts-check

/**
 * CommanderError class
 * @class
 */
class CommanderError extends Error {
  /**
   * Constructs the CommanderError class
   * @param {number} exitCode suggested exit code which could be used with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   * @constructor
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
 * InvalidOptionArgumentError class
 * @class
 */
class InvalidOptionArgumentError extends CommanderError {
  /**
   * Constructs the InvalidOptionArgumentError class
   * @param {string} [message] explanation of why argument is invalid
   * @constructor
   */
  constructor(message) {
    super(1, 'commander.invalidOptionArgument', message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

/**
 * NotImplementedError class
 * @class
 */
class NotImplementedError extends CommanderError {
  /**
   * Constructs the NotImplementedError class
   * @param {string} [message] human-readable description of the error
   * @constructor
   */
  constructor(message) {
    super(1, 'commander.notImplemented', message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

module.exports.CommanderError = CommanderError;
module.exports.InvalidOptionArgumentError = InvalidOptionArgumentError;
module.exports.NotImplementedError = NotImplementedError;
