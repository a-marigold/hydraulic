import { defineConfig } from 'rollup';

import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

import terser from '@rollup/plugin-terser';

export default defineConfig(
    {
        input: './src/index.ts',

        external: ['./src/__tests__/**'],

        output: {
            file: './dist/index.js',
            format: 'esm',
        },

        plugins: [
            typescript({
                exclude: ['**__tests__/**', '**/*.test.ts'],

                declaration: false,
            }),
            terser(),
        ],
    },

    {
        input: './src/index.ts',

        external: ['./src/__tests__/**'],

        output: {
            file: './dist/index.d.ts',

            format: 'esm',
        },

        plugins: [dts()],
    },
);
