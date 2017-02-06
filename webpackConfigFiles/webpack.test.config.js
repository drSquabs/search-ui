'use strict';
const _ = require('underscore');
const webpack = require('webpack');

let conf = require('./webpack.common.config');
conf = _.extend(conf, {
  entry: {
    'tests': ['./test/Test.ts'],
  },
  output: {
    path: require('path').resolve('./bin/tests'),
    filename: '[name].js',
    libraryTarget: 'var',
    library: 'Coveo',
    devtoolModuleFilenameTemplate: '[resource-path]'
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        ts: {
          project: '../test/tsconfig.json'
        }
      }
    })
  ]
})

module.exports = conf;
