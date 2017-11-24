import { assertReferences, assertNotReferences } from '../testHelpers';

describe('default import', () => {
    test('correct', () => {
        const code = `
            import foo from 'bar';

            TARGET(foo);
        `;

        assertReferences(code, 'bar', 'default');
    });

    test('wrong identifier', () => {
        const code = `
            import foo from 'bar';

            TARGET(baz);
        `;

        assertNotReferences(code, 'bar', 'default');
    });

    test('wrong import name', () => {
        const code = `
            import foo from 'bar';

            TARGET(foo);
        `;

        assertNotReferences(code, 'bar', 'foo');
    });
});

describe('named', () => {
    test('simple', () => {
        const code = `
            import { foo } from 'bar';

            TARGET(foo);
        `;

        assertReferences(code, 'bar', 'foo');
    });

    test('renamed', () => {
        const code = `
            import { foo as baz } from 'bar';

            TARGET(baz);
        `;

        assertReferences(code, 'bar', 'foo');
    });
});

describe('namespace, memberexpression at use site', () => {
    test('non-computed identifier property', () => {
        const code = `
            import * as bar from 'bar';

            TARGET(bar.foo);
        `;

        assertReferences(code, 'bar', 'foo');
    });

    test('computed literal property', () => {
        const code = `
            import * as bar from 'bar';

            TARGET(bar['foo']);
        `;

        assertReferences(code, 'bar', 'foo');
    });

    test('references wrong import name', () => {
        const code = `
            import * as bar from 'bar';

            TARGET(bar.baz);
        `;

        assertNotReferences(code, 'bar', 'foo');
    });

    test('computed identifier property named the same as import', () => {
        const code = `
            import * as bar from 'bar';

            TARGET(bar[foo]);
        `;

        assertNotReferences(code, 'bar', 'foo');
    });
});

describe('namespace, when checking for namespace', () => {
    test('correct case', () => {
        const code = `
            import * as foo from 'bar';

            TARGET(foo);
        `;

        assertReferences(code, 'bar', '*');
    });
});
