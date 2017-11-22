import { assertReferences, assertNotReferences } from '../testHelpers';

describe('default import', () => {
    test('correct', () => {
        const code = `
            import foo from 'bar';

            foo;
        `;

        assertReferences(code, 'bar', 'default');
    });

    test('wrong identifier', () => {
        const code = `
            import foo from 'bar';

            baz;
        `;

        assertNotReferences(code, 'bar', 'default');
    });

    test('wrong import name', () => {
        const code = `
            import foo from 'bar';

            foo;
        `;

        assertNotReferences(code, 'bar', 'foo');
    });
});

describe('named', () => {
    test('simple', () => {
        const code = `
            import { foo } from 'bar';

            foo;
        `;

        assertReferences(code, 'bar', 'foo');
    });

    test('renamed', () => {
        const code = `
            import { foo as baz } from 'bar';

            baz;
        `;

        assertReferences(code, 'bar', 'foo');
    });
});

describe('namespace', () => {
    test('non-computed identifier property', () => {
        const code = `
            import * as bar from 'bar';

            bar.foo;
        `;

        assertReferences(code, 'bar', 'foo');
    });

    test('computed literal property', () => {
        const code = `
            import * as bar from 'bar';

            bar['foo'];
        `;

        assertReferences(code, 'bar', 'foo');
    });

    test('references wrong import name', () => {
        const code = `
            import * as bar from 'bar';

            bar.baz;
        `;

        assertNotReferences(code, 'bar', 'foo');
    });

    test('computed identifier property named the same as import', () => {
        const code = `
            import * as bar from 'bar';

            bar[foo];
        `;

        assertNotReferences(code, 'bar', 'foo');
    });
});
