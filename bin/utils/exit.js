'use strict';

/**
 * Ends the process with specified code.
 * If omitted, exit uses the 'success' code 0.
 *
 * https://nodejs.org/api/process.html#process_exit_codes
 *
 * @param {Number} [code=0]
 */
function exit(code) {
  if (typeof code !== 'number') code = 0;
  process.exit(code);
}

module.exports = exit;
