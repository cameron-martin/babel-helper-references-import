import { NodePath } from 'babel-traverse';
import * as t from 'babel-types';

export function isAmdNamespaceImport(path: NodePath, packageName: string) {
    if(!path.isReferencedIdentifier()) return false;

    const binding = path.scope.getBinding(path.node.name);

    if(!binding) return false;
    if(!binding.path.isIdentifier()) return false;

    if(!binding.path.parentPath.isFunctionExpression() || binding.path.listKey !== 'params') return false;

    const factory = binding.path.parentPath;

    if(!factory.parentPath.isCallExpression() || factory.listKey !== 'arguments') return false;

    const defineExpression = factory.parentPath;
    const dependencyIndex = binding.path.key;

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
