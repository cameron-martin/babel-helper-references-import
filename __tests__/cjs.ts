import { assertReferences, assertNotReferences } from '../testHelpers';

describe('destructuring', () => {
    test('simple', () => {
        const code = `
            const { foo } = require('bar');

            TARGET(foo);
        `;

        assertReferences(code, 'bar', 'foo');
    });

    test('renaming', () => {
        const code = `
            const { foo: baz } = require('bar');

            TARGET(baz);
        `;

        assertReferences(code, 'bar', 'foo');
    });

    test('wrong package name', () => {
        const code = `
            const { foo: baz } = require('wrong-package');

            TARGET(baz);
        `;

        assertNotReferences(code, 'bar', 'foo');
    });

    test('not a require package name', () => {
        const code = `
            const { foo } = 1;

            TARGET(foo);
        `;

        assertNotReferences(code, 'bar', 'foo');
    });

    // REVIEW: Should this actually throw?
    test('binding not constant', () => {
        const code = `
            let { foo } = require('package');

            foo = 1;

            TARGET(foo);
        `;

        assertNotReferences(code, 'package', 'foo');
    });
});

describe('memberexpression at use site', () => {
    test('identifier property', () => {
        const code = `
            const bar = require('package');

            TARGET(bar.importName);
        `;

        assertReferences(code, 'package', 'importName');
    });

    test('string computed property', () => {
        const code = `
            const bar = require('package');

            TARGET(bar['importName']);
        `;

        assertReferences(code, 'package', 'importName');
    });

    test('not a require', () => {
        const code = `
            const bar = 1;

            TARGET(bar['importName']);
        `;

        assertNotReferences(code, 'package', 'importName');
    });

    test('not requiring correct package', () => {
        const code = `
            const bar = require('other-package');

            TARGET(bar['importName']);
        `;

        assertNotReferences(code, 'package', 'importName');
    });

    test('wrong import name', () => {
        const code = `
            const bar = require('package');

            TARGET(bar['otherImport']);
        `;

        assertNotReferences(code, 'package', 'importName');
    });

    // REVIEW: Should this actually throw?
    test('binding not constant', () => {
        const code = `
            let bar = require('package');

            bar = 1;

            TARGET(bar.importName);
        `;

        assertNotReferences(code, 'package', 'importName');
    });
});

describe('namespace import', () => {
    test('correct', () => {
        const code = `
            const foo = require('package');

            TARGET(foo);
        `;

        assertReferences(code, 'package', '*');
    });

    test('actually a member expression', () => {
        const code = `
            const foo = require('package');

            TARGET(foo.foo);
        `;

        assertNotReferences(code, 'package', '*');
    });
});
