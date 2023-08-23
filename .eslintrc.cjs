/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

const allExtensions = ['.ts', '.tsx', '.d.ts', '.js', '.jsx', '.json', '.vue', '.mjs'];

const path = require('node:path');
const createAliasSetting = require('@vue/eslint-config-airbnb/createAliasSetting');

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-airbnb-with-typescript'
  ],
  parserOptions: { ecmaVersion: 'latest' },
  rules: {
    'import/no-extraneous-dependencies': ['warn',
      {
        devDependencies: true,
        optionalDependencies: true,
        peerDependencies: true
      }
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'vue/no-template-target-blank': ['error', {
      allowReferrer: true,
      enforceDynamicLinks: 'never'
    }],
    'comma-dangle': ['error', 'never'],
    '@typescript-eslint/comma-dangle': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/max-len': 'off',
    'no-underscore-dangle': ['error', {
      allow: ['_id']
    }]
  },
  settings: {
    ...createAliasSetting({
      '@': `${path.resolve(__dirname, './src')}`
    }),
    'import/resolver': {
      node: { extensions: allExtensions }
    }
  }
};
