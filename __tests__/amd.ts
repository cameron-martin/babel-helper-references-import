import { assertReferences, assertNotReferences } from '../testHelpers';

describe('namespace import', () => {
    test('correct with id', () => {
        const code = `
            define('foo', ['require', 'package'], function(require, pkg) {
                TARGET(pkg);
            });
        `;

        assertReferences(code, 'package', '*');
    });

    test('correct without id', () => {
        const code = `
            define(['require', 'package'], function(require, pkg) {
                TARGET(pkg);
            });
        `;

        assertReferences(code, 'package', '*');
    });

    test('wrong package name', () => {
        const code = `
            define(['package', 'other-package'], function(_, pkg) {
                TARGET(pkg);
            });
        `;

        assertNotReferences(code, 'package', '*');
    });
});

describe('named import using memberexpression', () => {
    test('correct with id and standard factory', () => {
        const code = `
            define('foo', ['require', 'package'], function(require, pkg) {
                TARGET(pkg.importName);
            });
        `;

        assertReferences(code, 'package', 'importName');
    });

    test('correct without id and standard factory', () => {
        const code = `
            define(['require', 'package'], function(require, pkg) {
                TARGET(pkg.importName);
            });
        `;

        assertReferences(code, 'package', 'importName');
    });

    test('wrong package name', () => {
        const code = `
            define(['package', 'other-package'], function(_, pkg) {
                TARGET(pkg);
            });
        `;

        assertNotReferences(code, 'package', '*');
    });
});

describe('named import using destructuring', () => {
    test('simple', () => {
        const code = `
            define(['package'], function({ importName }) {
                TARGET(importName);
            });
        `;

        assertReferences(code, 'package', 'importName');
    });
    test('renaming', () => {
        const code = `
            define(['package'], function({ importName: foo }) {
                TARGET(foo);
            });
        `;

        assertReferences(code, 'package', 'importName');
    });
});
