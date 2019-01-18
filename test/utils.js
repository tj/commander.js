
const SKIPPED_MESSAGE = '**SKIPPED**';

exports.isWindows = function() {
    return process.platform == 'win32';
}

exports.skip = function() {
    process.stdout.write(SKIPPED_MESSAGE);
}

exports.isSkipped = function(stdout) {
    return stdout.indexOf(SKIPPED_MESSAGE) == 0;
}