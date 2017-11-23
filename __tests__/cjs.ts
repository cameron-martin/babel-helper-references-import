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

    test('not a require package name', () => {
        const code = `
            const { foo } = 1;

            foo;
        `;

        assertNotReferences(code, 'bar', 'foo');
    });
});

describe('memberexpression at use site', () => {
    test('correct with identifier property', () => {
        const code = `
            const bar = require('package');

            bar.importName;
        `;

        assertReferences(code, 'package', 'importName');
    });

    test('correct with string computed property', () => {
        const code = `
            const bar = require('package');

            bar['importName'];
        `;

        assertReferences(code, 'package', 'importName');
    });

    test('incorrect when not a require', () => {
        const code = `
            const bar = 1;

            bar['importName'];
        `;

        assertNotReferences(code, 'package', 'importName');
    });

    test('incorrect when not requiring correct package', () => {
        const code = `
            const bar = require('other-package');

            bar['importName'];
        `;

        assertNotReferences(code, 'package', 'importName');
    });

    test('incorrect when wrong import name', () => {
        const code = `
            const bar = require('package');

            bar['otherImport'];
        `;

        assertNotReferences(code, 'package', 'importName');
    });
});
