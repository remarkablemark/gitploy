const assert = require('assert');
const sinon = require('sinon');
const logger = require('../../../bin/utils/logger');

/* eslint-disable no-console */

describe('logger', () => {
  before(() => {
    sinon.stub(console, 'error');
    sinon.stub(console, 'info');
  });

  afterEach(() => {
    console.error.reset();
    console.info.reset();
  });

  after(() => {
    console.error.restore();
    console.info.restore();
  });

  it('is equivalent to console', () => {
    assert.equal(logger, console);
  });

  describe('info', () => {
    describe('when arguments=["foo","bar"]', () => {
      it('logs "foo bar"', () => {
        logger.info('foo', 'bar');
        sinon.assert.calledOnce(logger.info);
        sinon.assert.calledWith(logger.info, 'foo', 'bar');
      });
    });
  });

  describe('error', () => {
    describe('when arguments=["foo","bar"]', () => {
      it('logs "foo bar"', () => {
        logger.error('foo', 'bar');
        sinon.assert.calledOnce(logger.error);
        sinon.assert.calledWith(logger.error, 'foo', 'bar');
      });
    });
  });
});
