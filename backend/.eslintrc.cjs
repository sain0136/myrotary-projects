module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',  // Ensure this points to your TypeScript config
      ecmaVersion: 2020,           // Support ES6/ES2020 features
      sourceType: 'module',        // Use ES6 modules
    },
    env: {
      node: true,                  // Define Node.js global variables and Node.js scoping
      es2020: true,                // Enable ES6+ features
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',   // TypeScript linting rules
      'plugin:node/recommended',                 // Node.js-specific linting
    ],
    plugins: ['@typescript-eslint', 'node'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',  // Allow 'require()' in TypeScript
      'node/no-unsupported-features/es-syntax': 'off', // Disable errors for using ES6 modules
      'no-console': 'warn',    // Warn when using console.log (can be 'off' if you want no warnings)
      'prettier/prettier': 'error'  // Enforce Prettier formatting as an ESLint error
    },
    ignorePatterns: ['dist/', 'node_modules/'],  // Ignore compiled files and dependencies
  };
  