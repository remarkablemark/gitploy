const { resolve } = require('path');

module.exports.paths = {
  gitploy: resolve(__dirname, '../../bin/gitploy'),
  // proxyquire module dependencies are relative to required module
  utils: {
    exit: './utils/exit',
    logger: './utils/logger',
  },
};
