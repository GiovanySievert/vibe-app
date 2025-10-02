
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import * as tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', '.expo/', '.expo-shared/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      'simple-import-sort/imports':[ 'error', {
        groups: [
          ['^\\u0000'],
          ['^react$', '^react-native$', '^expo($|/)', '^@?react'],
          ['^(?!@src|@app|@shared|@core|@components)(@?\\w)'],
          ['^(@src|@app|@shared|@core)(/.*)?$'],
          ['^(@components|@src/shared/components)(/.*)?$'],
          ['^\\./components(/.*)?$'],
          ['^\\.\\.(?!/?$).*', '^\\./(?!components/).*'],
          ['^.+\\.(css|scss|sass|less)$'],
      ],
      }],
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',


    },
  },
];
