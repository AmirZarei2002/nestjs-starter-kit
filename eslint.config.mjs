// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      // ============================================
      // Import Pattern Enforcement Rules
      // ============================================

      // Prevent importing from 'src/' paths - use path aliases instead
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['src/*'],
              message:
                'Use path aliases (@common, @shared, @modules, etc.) instead of "src/" imports',
            },
            {
              group: ['**/infrastructure/prisma/**'],
              message:
                'Do not import directly from infrastructure layer. Use barrel exports from application or domain layer.',
            },
            {
              group: ['**/infrastructure/**'],
              message:
                'Infrastructure imports should be internal to the module. Use public APIs through barrel exports.',
            },
          ],
        },
      ],

      // Import order for better readability
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-in modules
            'external', // External packages (npm)
            'internal', // Internal path aliases (@common, @shared, etc.)
            'parent', // Parent directories (..)
            'sibling', // Same directory (./)
            'index', // Index files (./index)
          ],
          pathGroups: [
            {
              pattern: '@nestjs/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@common/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@shared/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@config/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@prisma/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@modules/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@*/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // Prevent importing from parent folders across modules
      'import/no-relative-parent-imports': 'off', // We allow relative parent imports within the same module

      // Ensure imports are at the top
      'import/first': 'error',

      // Ensure proper newline after imports
      'import/newline-after-import': 'error',

      // Prevent duplicate imports
      'import/no-duplicates': 'error',
    },
  },
  // Module composition roots are allowed to wire infrastructure internally.
  // Other files must not import from infrastructure paths directly.
  {
    files: ['src/modules/**/**.module.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['src/*'],
              message:
                'Use path aliases (@common, @shared, @modules, etc.) instead of "src/" imports',
            },
          ],
        },
      ],
    },
  },
  // Special rules for tests
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/test/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off', // Tests can import from anywhere
    },
  },
);