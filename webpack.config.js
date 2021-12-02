const path = require('path');

module.exports = [
  {
    mode: 'development',
    entry: path.join(__dirname, 'app', 'index.jsx'),
    target: 'electron-renderer',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        }
      ]
    },
    resolve: {
      fallback: {
        'fs': false,
        'path': false,
      },
      extensions: ['.js', '.jsx', '.wasm', '.ts', '.tsx', '.mjs', '.cjs', '.json'],
    },
  },
  {
    mode: 'development',
    entry: './main.ts',
    target: 'electron-main',
    output: {
      path: __dirname,
      filename: './main.js',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      fallback: {
        'fs': false,
        'path': false,
      },
      extensions: ['.js', '.jsx', '.wasm', '.ts', '.tsx', '.mjs', '.cjs', '.json'],
      modules: [path.resolve(__dirname, 'node_modules')],
    },
  }
];
