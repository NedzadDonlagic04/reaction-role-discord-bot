import esLintTsPlugin from '@typescript-eslint/eslint-plugin';
import esLintTsParser from '@typescript-eslint/parser';

export default [
    {
        files: ['src/**/*.ts'],
        ignores: ['node_modules', 'dist', '.husky', '.env'],
        languageOptions: {
            parser: esLintTsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': esLintTsPlugin,
        },
        rules: {},
    },
];
