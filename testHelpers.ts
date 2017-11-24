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
    const state = { targetSeen: false };

    traverse(ast, {
        CallExpression(path, state) {
            const callee = path.get('callee');

            if(!callee.isIdentifier() || callee.node.name !== 'TARGET') {
                return;
            }

            if(state.targetSeen) {
                throw new Error('You cannot specify TARGET multiple times in a test case');
            }

            state.targetSeen = true;

            if(path.node.arguments.length !== 1) {
                throw new Error('TARGET must be called with a single argument');
            }

            const target = path.get('arguments.0');

            expect(referencesImport(target, packageName, importName)).toBe(result);
        }
    }, undefined, state);

    if(!state.targetSeen) {
        throw new Error('Test case must specify a TARGET');
    }
}
