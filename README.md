# babel-helper-references-import

[![Build Status](https://travis-ci.org/cameron-martin/babel-helper-references-import.svg?branch=master)](https://travis-ci.org/cameron-martin/babel-helper-references-import)
[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](http://www.repostatus.org/badges/latest/wip.svg)](http://www.repostatus.org/#wip)
[![dependencies Status](https://david-dm.org/cameron-martin/babel-helper-references-import/status.svg)](https://david-dm.org/cameron-martin/babel-helper-references-import)
[![Join the chat at https://gitter.im/cameron-martin/babel-helper-references-import](https://badges.gitter.im/cameron-martin/babel-helper-references-import.svg)](https://gitter.im/cameron-martin/babel-helper-references-import?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Checks whether an `Identifier` or `MemberExpression` references a specific import from a specific package.

Like [`referencesImport`][referencesImport], but works with ES2015, CommonJS and AMD syntax.

[referencesImport]: https://github.com/babel/babel/blob/a1c7449a9276987ead4788c4333190c922ba0658/packages/babel-traverse/src/path/introspection.js#L160

## API

This package contains a single named export:

### `referencesImport(path: NodePath, packageName: string, importName: string): boolean;`

* `path` is a path to the node that you want to test whether it references an import from a package.
* `packageName` is the name of the package.
* `importName` is the name of the import. It can take a special value, `*`, to indicate that you want to test that the whole namespace is imported, for example when testing that `foo` references `import * as foo from 'package';` or `const foo = require('package');`

## TODO

* Dynamic imports
* Consider when errors should be thrown rather than just not matching.
