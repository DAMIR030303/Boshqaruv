module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // React va clsx uchun default import xatolarini o'chirish
    'import/default': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    // Import tartibi qoidalari - import/order (yangi, yaxshiroq)
    'import/order': [
      'error',
      {
        groups: [
          'builtin',   // Node.js built-in modules
          'external',   // External libraries
          'internal',   // Internal modules (@/ aliases)
          'parent',     // Parent imports
          'sibling',    // Sibling imports
          'index',      // Index imports
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-dom',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-dom'],
      },
    ],
    // Import tartibi qoidalari - sort-imports (eski, lekin hali ham ishlatiladi)
    'sort-imports': [
      'off', // import/order bilan birga ishlatilmaydi, o'chirildi
    ],
  },
}
