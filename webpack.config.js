var path = require('path')
// var nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './hyper-readings.es.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'hyper-readings.js',
    library: 'HyperReadings',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: `typeof self !== 'undefined' ? self : this`
  },
  externals: [
    'fs',
    'crypto'
    // nodeExternals()
  ],
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'lib'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
