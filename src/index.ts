import { NodePath } from 'babel-traverse';
import * as t from 'babel-types';

export function referencesImport(path: NodePath, packageName: string, importName: string): boolean {
    // Most es6 imports
    if(path.referencesImport(packageName, importName)) return true;

    // import * as foo from 'bar'; foo.baz;
    // import * as foo from 'bar'; foo['baz'];
    // const package = require('package'); package.foo;
    // const package = require('package'); package['foo'];
    if(isStaticMemberExpression(path, importName) && referencesImport(path.get('object'), packageName, '*')) return true;
    if(isDestructuringRequire(path, packageName, importName)) return true;
    if(isCommonjsNamespaceImport(path, packageName, importName)) return true;

    return false;
}

/**
 * const { foo: bar } = require('baz'); bar;
 * const { foo } = require('baz'); foo;
 */
function isDestructuringRequire(path: NodePath, packageName: string, importName: string): boolean {
    if(!path.isReferencedIdentifier()) return false;

    const binding = path.scope.getBinding(path.node.name);
    const bindingIdentifier = path.scope.getBindingIdentifier(path.node.name);

    if(!binding || !binding.path.isVariableDeclarator()) return false;
    if(!binding.constant) return false;
    if(!isRequire(binding.path.get('init'), packageName)) return false;

    const id = binding.path.get('id');
    if(!id.isObjectPattern()) return false;

    const propertyIndex = id.node.properties.findIndex(property => t.isObjectProperty(property) && property.value === bindingIdentifier);

    if(propertyIndex === -1) return false;

    const property = id.get(`properties.${propertyIndex}`) as NodePath<t.AssignmentProperty>;
    const key = property.get('key');

    if(!key.isIdentifier() || key.node.name !== importName) return false;

    return true;
}

/**
 * const package = require('package'); package;
 */
function isCommonjsNamespaceImport(path: NodePath, packageName: string, importName: string): boolean {
    if(importName !== '*') return false;

    if(!path.isReferencedIdentifier()) return false;

    const binding = path.scope.getBinding(path.node.name);

    if(!binding || !binding.path.isVariableDeclarator()) return false;
    if(!binding.constant) return false;

    const id = binding.path.get('id');

    if(!id.isIdentifier()) return false;

    if(!isRequire(binding.path.get('init'), packageName)) return false;

    return true;
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

function isRequire(path: NodePath, packageName: string) {
    if(!path.isCallExpression()) return false;

    const callee = path.get('callee');
    if(!callee.isIdentifier()) return false;
    if(callee.node.name !== 'require') return false;

    if(path.node.arguments.length !== 1) return false;
    const argument = path.get('arguments.0');
    if(!argument.isStringLiteral()) return false;
    if(argument.node.value !== packageName) return false;

    return true;
}
