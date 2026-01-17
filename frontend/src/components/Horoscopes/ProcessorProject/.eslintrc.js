module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    semi: [2, 'always'],
    indent: ['error', 2],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/react-in-jsx-scope': 'off',
    forceConsistentCasingInFileNames: 'off',
    'no-trailing-spaces': 'off',
    'quote-props': 'off',
    'camelcase': 'off',
    'no-mixed-operators': 'off',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
