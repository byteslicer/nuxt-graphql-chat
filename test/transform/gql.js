// fileTransformer.js
const gql = require('graphql-tag');

module.exports = {
  process(src, filename, config, options) {
    return 'module.exports = ' + JSON.stringify(gql`${src}`) + ';';
  },
};
