import { NodePath } from 'babel-traverse';
import * as t from 'babel-types';

/**
 * const package = require('package'); package;
 */
export function isCommonjsNamespaceImport(path: NodePath, packageName: string): boolean {
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
 * const { foo: bar } = require('baz'); bar;
 * const { foo } = require('baz'); foo;
 */
export function isDestructuringRequire(path: NodePath, packageName: string, importName: string): boolean {
    if(!path.isReferencedIdentifier()) return false;

    const binding = path.scope.getBinding(path.node.name);
    const bindingIdentifier = path.scope.getBindingIdentifier(path.node.name);

    if(!binding || !binding.path.isVariableDeclarator()) return false;
    if(!binding.constant) return false;
    if(!isRequire(binding.path.get('init'), packageName)) return false;

    const id = binding.path.get('id');
    if(!id.isObjectPattern()) return false;

    const property = id.node.properties.find(property => t.isObjectProperty(property) && property.value === bindingIdentifier);

    return property && t.isIdentifier(property.key, { name: importName });
}

function isRequire(path: NodePath, packageName: string) {
    if(!path.isCallExpression()) return false;

    const callee = path.get('callee');
    if(!callee.isIdentifier({ name: 'require' })) return false;

    if(path.node.arguments.length !== 1) return false;
    const argument = path.get('arguments.0');

    return argument.isStringLiteral({ value: packageName });
}
