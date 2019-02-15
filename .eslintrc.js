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
    }
};
