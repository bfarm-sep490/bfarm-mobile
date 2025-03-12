module.exports = {
  extends: [
    'universe',
    'universe/shared/typescript-analysis',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        bracketSameLine: false,
        singleQuote: true,
        jsxSingleQuote: true,
        trailingComma: 'all',
        endOfLine: 'auto',
      },
    ],
    'import/extensions': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'type',
          'object',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-native',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@gluestack-ui/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-native'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    // Rest of your rules remain the same
    'padded-blocks': 'off',
    'no-underscore-dangle': 'off',
    'max-len': [1, 1000, 4],
    quotes: [2, 'single'],
    'linebreak-style': 0,
    semi: [1, 'always'],
    'no-console': [0],
    'no-loop-func': [0],
    'new-cap': [0],
    'no-trailing-spaces': [0],
    'no-param-reassign': [0],
    'func-names': [0],
    'comma-dangle': [0],
    'no-unused-expressions': [0],
    'block-scoped-var': [0],
    'no-nested-ternary': 'off',
    'no-multiple-empty-lines': [2, { max: 2 }],
    'import/newline-after-import': ['error', { count: 1 }],
    'import/no-unresolved': 'off',
    'no-use-before-define': 'off',
    'prefer-arrow-callback': 'off',
    camelcase: 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
};
