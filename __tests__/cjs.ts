import { assertReferences, assertNotReferences } from '../testHelpers';

describe('destructuring', () => {
    test('simple', () => {
        const code = `
            const { foo } = require('bar');

            foo;
        `;

        assertReferences(code, 'bar', 'foo');
    });

    test('renaming', () => {
        const code = `
            const { foo: baz } = require('bar');

            baz;
        `;

        assertReferences(code, 'bar', 'foo');
    });

    test('wrong package name', () => {
        const code = `
            const { foo: baz } = require('wrong-package');

            baz;
        `;

        assertNotReferences(code, 'bar', 'foo');
    });
});

describe('memberexpression at use site', () => {
    test.skip('correct', () => {
        const code = `
            const bar = require('package');

            bar.importName;
        `;

        assertReferences(code, 'package', 'importName');
    });
});
