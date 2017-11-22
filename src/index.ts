import { NodePath } from 'babel-traverse';
import * as t from 'babel-types';

export function referencesImport(path: NodePath, packageName: string, importName: string): boolean {
    if(isEs6Import(path, packageName, importName)) return true;
    if(isDestructuringRequire(path, packageName, importName)) return true;

    return false;
}

function isEs6Import(path: NodePath, packageName: string, importName: string) {
    // Most es6 imports
    if(path.referencesImport(packageName, importName)) return true;

    if(path.isMemberExpression()) {
        const property = path.get('property');

        // import * as foo from 'bar'; foo.baz;
        if(
            (!path.node.computed && property.isIdentifier() && property.node.name === importName) &&
            path.get('object').referencesImport(packageName, '*')
        ) return true;

        // import * as foo from 'bar'; foo['baz'];
        if(
            (property.isStringLiteral() && property.node.value === importName) &&
            path.get('object').referencesImport(packageName, '*')
        ) return true;
    }

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
