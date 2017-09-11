#!/usr/bin/env node

'use strict';

/**
 * Display package information.
 */
var pkg = require('../package.json');
var GITPLOY = pkg.name;
var logger = require('./utils/logger');
logger.info('Version:', GITPLOY, pkg.version);

/**
 * Get command line arguments.
 */
var directory = process.argv[2];
var branch = process.argv[3];

/**
 * Exit if arguments are invalid.
 */
var errorMessage;
var exit = require('./utils/exit');

if (!directory && !branch) {
  errorMessage = 'Error: Expected arguments <directory> and <branch>';
} else if (!branch) {
  errorMessage = 'Error: Expected argument <branch>';
}

if (errorMessage) {
  logger.info('Usage:', GITPLOY, '<directory> <branch>');
  logger.error(errorMessage);
  exit(9);
}

/**
 * Module dependencies.
 */
var execSync = require('child_process').execSync;

/**
 * Check git command.
 */
try {
  execSync('git --version');
} catch (error) {
  // git: command not found
  exit(1);
}

/**
 * Get author from git config (if applicable).
 */
var author = execSync('git config user.name').toString().trim() || GITPLOY;
var email = execSync('git config user.email').toString().trim();
if (email) {
  author += ' <' + email + '>';
}

/**
 * Get url of remote origin.
 */
var originUrl = execSync('git remote get-url origin').toString().trim();

/**
 * Change to directory.
 */
try {
  process.chdir(directory);
} catch (error) {
  logger.error('Error: No such directory:', directory);
  exit(9);
}

/**
 * Initialize git repository and add remote.
 */
execSync('git init');
execSync('git remote add origin ' + originUrl);

/**
 * Check state of working directory has untracked files.
 */
var state = execSync('git status --short').toString().trim();
if (!state) {
  logger.error('Error: No files found in:', directory);
  exit(1);
}

/**
 * Commit all files in directory.
 */
execSync('git add .');
execSync('git commit --message "' + GITPLOY + '" --author="' + author + '"');

/**
 * Push to deploy branch.
 */
logger.info('Info: Deploying to branch:', branch);
execSync('git push --force origin master:' + branch);
