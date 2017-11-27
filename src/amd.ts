import { NodePath } from 'babel-traverse';
import * as t from 'babel-types';
import { isDestructuringOf } from './shared';

export function isAmdNamespaceImport(path: NodePath, packageName: string) {
    if(!path.isReferencedIdentifier()) return false;

    const binding = path.scope.getBinding(path.node.name);

    if(!binding || !binding.path.isIdentifier()) return false;

    return isAmdParamForPackage(binding.path, packageName);
}

export function isAmdDestructuring(path: NodePath, packageName: string, importName: string) {
    if(!path.isReferencedIdentifier()) return false;

    const binding = path.scope.getBinding(path.node.name);

    if(!binding) return false;
    if(!isDestructuringOf(binding.path, binding.identifier, importName)) return false;

    return isAmdParamForPackage(binding.path, packageName);
}

/**
 * Is paramPath the parameter of an amd factory for a specific package?
 */
function isAmdParamForPackage(paramPath: NodePath, packageName: string) {
    if(!paramPath.parentPath.isFunctionExpression() || paramPath.listKey !== 'params') return false;

    const factory = paramPath.parentPath;

    if(!factory.parentPath.isCallExpression() || factory.listKey !== 'arguments') return false;

    const defineExpression = factory.parentPath;
    const dependencyIndex = paramPath.key;

    let dependencyNames: NodePath;
    if(defineExpression.node.arguments.length === 2) {
        dependencyNames = defineExpression.get('arguments.0');
    } else if(defineExpression.node.arguments.length === 3) {
        dependencyNames = defineExpression.get('arguments.1');
    } else {
        return false;
    }

    if(!dependencyNames.isArrayExpression()) return false;

    const dependencyName = dependencyNames.get(`elements.${dependencyIndex}`);

    return dependencyName.isStringLiteral({ value: packageName });
}
