import * as t from 'babel-types';
import { NodePath } from 'babel-traverse';

export function isDestructuringOf(path: NodePath, identifier: t.Identifier, importName: string): boolean {
    if(!path.isObjectPattern()) return false;

    const property = path.node.properties.find(property => t.isObjectProperty(property) && property.value === identifier) as t.ObjectProperty | undefined;

    return property ? t.isIdentifier(property.key, { name: importName }) : false;
}
