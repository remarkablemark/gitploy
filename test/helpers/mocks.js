const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const sinon = require('sinon');
const { paths } = require('./constants');

/**
 * Creates a mock for gitploy.
 *
 * @param  {Object} [stubs={}] - The stub overrides.
 * @return {Object}            - The proxyquire stubs.
 */
module.exports.mockGitploy = (stubs = {}) => {
  const proxyquireStubs = {
    // internal method that resets all stubs
    _reset: function() {
      Object.keys(this).forEach(path => {
        const module = this[path];
        if (!module || path[0] === '_') return;
        if (typeof module === 'function') {
          module.reset();
        } else {
          Object.keys(module).forEach(method => {
            module[method].reset();
          });
        }
      });
    },

    // utils
    [paths.utils.exit]: stubs[paths.utils.exit] || sinon.stub(),
    [paths.utils.logger]: {
      error: sinon.stub().returns(''),
      info: sinon.stub().returns(''),
      ...stubs[paths.utils.logger],
    },

    // module dependencies
    child_process: {
      execSync: sinon.stub().returns(''),
      ...stubs.child_process,
    },
  };

  // internal method that requires gitploy with stubs
  proxyquireStubs._require = proxyquire.bind(null, paths.gitploy, proxyquireStubs);

  return proxyquireStubs;
};

/**
 * Creates a mock for process object.
 *
 * @return {Object} - The process stub.
 */
module.exports.mockProcess = () => {
  return {
    // internal method that resets all stubs
    _reset: function() {
      Object.keys(this).forEach(method => {
        if (method[0] !== '_') this[method].reset();
      });
    },
    // internal method that restores methods
    _restore: function() {
      Object.keys(this).forEach(method => {
        if (method[0] !== '_') this[method].restore();
      });
    },

    // methods
    chdir: sinon.stub(process, 'chdir'),
    cwd: sinon.stub(process, 'cwd').returns(''),
    exit: sinon.stub(process, 'exit'),
  };
};
