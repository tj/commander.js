/**
 * CommanderError class
 * @class
 */
export class CommanderError extends Error {
    /**
     * Constructs the CommanderError class
     * @param {number} exitCode suggested exit code which could be used with process.exit
     * @param {string} code an id string representing the error
     * @param {string} [message] human-readable description of the error
     * @constructor
     */
    constructor(exitCode: number, code: string, message?: string | undefined);
    code: string;
    exitCode: number;
    nestedError: any;
}
/**
 * InvalidArgumentError class
 * @class
 */
export class InvalidArgumentError extends CommanderError {
    /**
     * Constructs the InvalidArgumentError class
     * @param {string} [message] explanation of why argument is invalid
     * @constructor
     */
    constructor(message?: string | undefined);
}
//# sourceMappingURL=error.d.ts.map