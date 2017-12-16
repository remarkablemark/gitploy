# gitploy

[![NPM](https://nodei.co/npm/gitploy.png)](https://nodei.co/npm/gitploy/)

[![NPM version](https://img.shields.io/npm/v/gitploy.svg)](https://www.npmjs.com/package/gitploy)
[![Build Status](https://travis-ci.org/remarkablemark/gitploy.svg?branch=master)](https://travis-ci.org/remarkablemark/gitploy)
[![Coverage Status](https://coveralls.io/repos/github/remarkablemark/gitploy/badge.svg?branch=master)](https://coveralls.io/github/remarkablemark/gitploy?branch=master)

CLI that deploys directory to remote Git branch:
```
gitploy <directory> <branch>
```

## Installation

[NPM](https://www.npmjs.com/package/gitploy):
```sh
# global
npm install --global gitploy

# local
npm install gitploy
```

[Yarn](https://yarn.fyi/gitploy):
```sh
# global
yarn global add gitploy

# local
yarn add gitploy
```

## Usage

If `gitploy` is installed globally:
```sh
gitploy directory branch
```

If `gitploy` is installed locally:
```sh
# with npx
npx gitploy directory branch

# with binary
node_modules/.bin/gitploy directory branch # $(npm bin)/gitploy directory branch
```

## Testing

```sh
$ npm test
$ npm run lint:fix
```

## License

[MIT](https://github.com/remarkablemark/gitploy/blob/master/LICENSE)
