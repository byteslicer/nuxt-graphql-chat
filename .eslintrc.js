module.exports = {
  extends: [
    'plugin:vue/recommended',
    'airbnb-base'
  ],

  rules: {
    "vue/max-attributes-per-line": ["warning", {
      "singleline": 3,
    }]
  },

  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './']
        ],
        extensions: ['.js', '.vue']
      }
    }
  },

  overrides: [
    {
      files: [
        "**/*.test.js"
      ],
      env: {
        jest: true // now **/*.test.js files' env has both es6 *and* jest
      },
      // Can't extend in overrides: https://github.com/eslint/eslint/issues/8813
      // "extends": ["plugin:jest/recommended"]
      plugins: ["jest"],
      rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
      }
    }
  ],
};
