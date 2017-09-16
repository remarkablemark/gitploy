const sinon = require('sinon');
const exit = require('../../../bin/utils/exit');

describe('exit', () => {
  before(() => {
    sinon.stub(process, 'exit');
  });

  afterEach(() => {
    process.exit.reset();
  });

  after(() => {
    process.exit.restore();
  });

  describe('when code=undefined', () => {
    it('calls process.exit(0)', () => {
      exit();
      sinon.assert.calledOnce(process.exit);
      sinon.assert.calledWith(process.exit, 0);
    });
  });

  describe('when code="9"', () => {
    it('calls process.exit(0)', () => {
      exit('9');
      sinon.assert.calledOnce(process.exit);
      sinon.assert.calledWith(process.exit, 0);
    });
  });

  describe('when code=1', () => {
    it('calls process.exit(1)', () => {
      exit(1);
      sinon.assert.calledOnce(process.exit);
      sinon.assert.calledWith(process.exit, 1);
    });
  });
});
