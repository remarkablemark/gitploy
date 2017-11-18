const sinon = require('sinon');
const pkg = require('../../package.json');
const { paths } = require('../helpers/constants');
const { mockGitploy, mockProcess } = require('../helpers/mocks');

describe('gitploy', () => {
  const argv = ['node', 'gitploy.js'];
  const directory = 'directory';
  const branch = 'branch';
  let gitployMock;
  let processMock;

  before(() => processMock = mockProcess());
  after(() => processMock._restore());

  describe('when no arguments are passed', () => {
    beforeEach(() => {
      process.argv = argv;
      gitployMock = mockGitploy();
      gitployMock._require();
    });

    it('logs package version', () => {
      sinon.assert.calledWith(
        gitployMock[paths.utils.logger].info,
        'Version:', pkg.name, pkg.version
      );
    });

    it('logs usage information', () => {
      sinon.assert.calledWith(
        gitployMock[paths.utils.logger].info,
        'Usage:', pkg.name, '<directory> <branch>'
      );
    });

    it('logs error', () => {
      sinon.assert.calledWith(
        gitployMock[paths.utils.logger].error,
        'Error: Expected arguments <directory> and <branch>'
      );
    });

    it('exits with code 9', () => {
      sinon.assert.calledWith(gitployMock[paths.utils.exit], 9);
    });
  });

  describe('when one argument is passed', () => {
    beforeEach(() => {
      process.argv = [...argv, directory];
      gitployMock = mockGitploy();
      gitployMock._require();
    });

    it('logs package version', () => {
      sinon.assert.calledWith(
        gitployMock[paths.utils.logger].info,
        'Version:', pkg.name, pkg.version
      );
    });

    it('logs usage information', () => {
      sinon.assert.calledWith(
        gitployMock[paths.utils.logger].info,
        'Usage:', pkg.name, '<directory> <branch>'
      );
    });

    it('logs error', () => {
      sinon.assert.calledWith(
        gitployMock[paths.utils.logger].error,
        'Error: Expected argument <branch>'
      );
    });

    it('exits with code 9', () => {
      sinon.assert.calledWith(gitployMock[paths.utils.exit], 9);
    });
  });

  describe('when two arguments are passed', () => {
    beforeEach(() => {
      process.argv = [...argv, directory, branch];
      gitployMock = mockGitploy();
    });

    it('logs package version', () => {
      gitployMock._require();
      sinon.assert.calledWith(
        gitployMock[paths.utils.logger].info,
        'Version:', pkg.name, pkg.version
      );
    });

    it('does not log usage information', () => {
      gitployMock._require();
      sinon.assert.neverCalledWith(
        gitployMock[paths.utils.logger].info,
        'Usage:', pkg.name, '<directory> <branch>'
      );
    });

    describe('and git command is not found', () => {
      it('exits with code 1', () => {
        const { child_process: { execSync } } = gitployMock;
        execSync.withArgs('git --version').throws();
        gitployMock._require();
        sinon.assert.calledWith(gitployMock[paths.utils.exit], 1);
      });
    });

    describe('and directory does not exist', () => {
      it('logs error', () => {
        processMock.chdir.throws();
        gitployMock._require();
        sinon.assert.calledWith(
          gitployMock[paths.utils.logger].error,
          'Error: No such directory:', directory
        );
      });

      it('exits with code 9', () => {
        processMock.chdir.throws();
        gitployMock._require();
        sinon.assert.calledWith(gitployMock[paths.utils.exit], 9);
      });
    });

    describe('and directory is empty', () => {
      it('logs error', () => {
        gitployMock._require();
        sinon.assert.calledWith(
          gitployMock[paths.utils.logger].error,
          'Error: No files found in:', directory
        );
      });

      it('exits with code 1', () => {
        gitployMock._require();
        sinon.assert.calledWith(gitployMock[paths.utils.exit], 1);
      });
    });

    describe('and directory has files', () => {
      it('changes to directory', () => {
        gitployMock._require();
        sinon.assert.calledWith(processMock.chdir, directory);
      });

      it('does not log error', () => {
        const { child_process: { execSync } } = gitployMock;
        execSync.withArgs('git status --short').returns('?? file.txt\n');
        gitployMock._require();
        sinon.assert.neverCalledWith(
          gitployMock[paths.utils.logger].error,
          'Error: No files found in:', directory
        );
      });

      it('does not exit with code 1', () => {
        const { child_process: { execSync } } = gitployMock;
        execSync.withArgs('git status --short').returns('?? file.txt\n');
        gitployMock._require();
        sinon.assert.neverCalledWith(gitployMock[paths.utils.exit], 1);
      });

      it('initializes repository with remote', () => {
        const remote = 'git@github.com:jsmith/repo.git';
        const { child_process: { execSync } } = gitployMock;
        execSync.withArgs('git remote get-url origin').returns(`\n${remote}\n`);
        gitployMock._require();

        sinon.assert.calledWith(execSync, 'git init');
        sinon.assert.calledWith(execSync, `git remote add origin ${remote}`);
      });

      it('commits with config author', () => {
        const author = 'John Smith';
        const email = 'john@smith.com';
        const { child_process: { execSync } }  = gitployMock;
        execSync.withArgs('git config user.name').returns(`\n${author}\n`);
        execSync.withArgs('git config user.email').returns(`\n${email}\n`);
        gitployMock._require();

        sinon.assert.calledWith(execSync, 'git add .');
        sinon.assert.calledWith(
          execSync,
          `git commit --message "${pkg.name}" --author="${author} <${email}>"`
        );
      });

      it('commits with fallback author', () => {
        const { child_process: { execSync } }  = gitployMock;
        gitployMock._require();

        sinon.assert.calledWith(execSync, 'git add .');
        sinon.assert.calledWith(
          execSync,
          `git commit --message "${pkg.name}" --author="${pkg.name}"`
        );
      });

      it('pushes to remote branch', () => {
        gitployMock._require();
        const { child_process: { execSync } }  = gitployMock;
        sinon.assert.calledWith(
          execSync,
          `git push --force origin master:${branch}`
        );
      });

      it('logs deploy info', () => {
        gitployMock._require();
        sinon.assert.calledWith(
          gitployMock[paths.utils.logger].info,
          'Info: Deploying to branch:', branch
        );
      });
    });
  });
});
