import * as t from 'babel-types';
import { NodePath } from 'babel-traverse';

/**
 * Checks whether an identifier is a destructuring of a specific property in an ObjectPattern.
 */
export function isDestructuringOf(path: NodePath, identifier: t.Identifier, propertyName: string): boolean {
    if(!path.isObjectPattern()) return false;

    const property = path.node.properties.find(property => t.isObjectProperty(property) && property.value === identifier) as t.ObjectProperty | undefined;

    return property ? t.isIdentifier(property.key, { name: propertyName }) : false;
}
