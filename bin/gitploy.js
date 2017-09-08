#!/usr/bin/env node

'use strict';

/* eslint-disable no-console */

/**
 * Display package information.
 */
var pkg = require('../package.json');
var GITPLOY = pkg.name;
console.info('Version:', GITPLOY, pkg.version);

/**
 * Get command line arguments.
 */
var directory = process.argv[2];
var branch = process.argv[3];

/**
 * Exit if arguments are invalid.
 */
var errorMessage;
if (!directory && !branch) {
  errorMessage = 'Error: Expected arguments <directory> and <branch>';
} else if (!branch) {
  errorMessage = 'Error: Expected argument <branch>';
}

if (errorMessage) {
  console.info('Usage:', GITPLOY, '<directory> <branch>');
  console.error(errorMessage);
  process.exit(9);
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
  process.exit(1);
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
  console.error('Error: No such directory:', directory);
  process.exit(9);
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
  console.error('Error: No files found in:', directory);
  process.exit(1);
}

/**
 * Commit all files in directory.
 */
execSync('git add .');
execSync('git commit --message "' + GITPLOY + '" --author="' + author + '"');

/**
 * Push to deploy branch.
 */
console.info('Info: Deploying to branch:', branch);
execSync('git push --force origin master:' + branch);
