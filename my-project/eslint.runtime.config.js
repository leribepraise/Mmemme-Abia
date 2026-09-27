import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

// Deployment gate for errors that can break pages, independent of style cleanup.
export default [{
  files: ['**/*.{js,jsx}'],
  languageOptions: {
    globals: globals.browser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
  plugins: { 'react-hooks': reactHooks },
  rules: {
    'no-undef': 'error',
    'no-unreachable': 'error',
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error',
    'react-hooks/rules-of-hooks': 'error',
  },
}];
