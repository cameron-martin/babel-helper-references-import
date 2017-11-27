import * as t from 'babel-types';
import { NodePath } from 'babel-traverse';

export function isDestructuringOf(path: NodePath, identifier: t.Identifier, importName: string) {
    if(!path.isObjectPattern()) return false;

    const property = path.node.properties.find(property => t.isObjectProperty(property) && property.value === identifier);

    return property && t.isIdentifier(property.key, { name: importName });
}
