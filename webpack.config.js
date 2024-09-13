const path = require('path');

module.exports = {
  mode: 'development',
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  entry: './src/run.js',
  output: {
    filename: 'run.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
