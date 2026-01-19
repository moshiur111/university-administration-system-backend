import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  // Files to lint
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },

  // Environment globals (Node.js backend)
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Project-specific rules
  {
    ignores: ['node_modules', 'dist'],

    rules: {
      // Unused vars handling (correct for TS + Express)
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Code quality
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',

      // TypeScript relaxations (backend-friendly)
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
];
