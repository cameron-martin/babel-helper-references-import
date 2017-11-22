import traverse from 'babel-traverse';
import * as babylon from 'babylon';

import { referencesImport } from './src/index';


export function assertReferences(source: string, packageName: string, importName: string) {
    return _assert(source, packageName, importName, true);
}

export function assertNotReferences(source: string, packageName: string, importName: string) {
    return _assert(source, packageName, importName, false);
}

function _assert(source: string, packageName: string, importName: string, result: boolean) {
    const ast = babylon.parse(source, { sourceType: 'module' });
    
    traverse(ast, {
        Program(path) {
            const lastStatement = path.get(`body.${path.node.body.length - 1}`);
            const lastExpression = lastStatement.get('expression');

            expect(referencesImport(lastExpression, packageName, importName)).toBe(result);
        }
    });
}