import { NodePath } from 'babel-traverse';
import * as t from 'babel-types';
import { isDestructuringRequire, isCommonjsNamespaceImport } from './commonjs';

export function referencesImport(path: NodePath, packageName: string, importName: string): boolean {
    // Most es6 imports
    if(path.referencesImport(packageName, importName)) return true;

    // import * as foo from 'bar'; foo.baz;
    // import * as foo from 'bar'; foo['baz'];
    // const package = require('package'); package.foo;
    // const package = require('package'); package['foo'];
    if(isStaticMemberExpression(path, importName) && referencesImport(path.get('object'), packageName, '*')) return true;

    if(isDestructuringRequire(path, packageName, importName)) return true;
    if(importName === '*' && isCommonjsNamespaceImport(path, packageName)) return true;

    return false;
}

/**
 * Is this path a MemberExpression with a specific static property?
 */
function isStaticMemberExpression(path: NodePath, propertyName: string): path is NodePath<t.MemberExpression> {
    if(!path.isMemberExpression()) return false;

    const property = path.get('property');

    if(!path.node.computed && property.isIdentifier() && property.node.name === propertyName) return true;
    if(property.isStringLiteral() && property.node.value === propertyName) return true;

    return false;
}
