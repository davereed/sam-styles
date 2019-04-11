const path = require('path');
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);
const presetConfig = require("./build-utils/loadPresets");

const SRC_DIR = './src/';
const PUB_DIR = './dist/';

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
  return webpackMerge(
    {
      mode,
      entry: "./src/js/start.js",
      module: {
        rules: [
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
              { 
                loader: MiniCssExtractPlugin.loader,
                options: { publicPath: '../' }
              },
              { loader: 'css-loader', options: { sourceMap: true } },
              'postcss-loader',
              { loader: 'sass-loader', options: { sourceMap: true } }
            ]
          },
          {
            test: /\.(woff(2)?|ttf|eot|svg|png)$/,
            use: [
              {
                loader: "file-loader",
                options: {
                  outputPath: (url, resourcePath, context) => {
                    const dirNameArr = resourcePath.split('/');
                    const imgPathIdx = dirNameArr.indexOf('img');
                    const fontPathIdx = dirNameArr.indexOf('fonts');
                    if(imgPathIdx !== -1){
                      return dirNameArr.slice(imgPathIdx).join('/');
                    } else if(fontPathIdx !== -1){
                      return dirNameArr.slice(fontPathIdx).join('/');
                    }
                    return url;
                  }
                }
              }
            ]
          }
        ]
      },
      plugins: [
        // new CleanWebpackPlugin(['dist']),
        new StyleLintPlugin(),
        new MiniCssExtractPlugin({
          filename: 'css/sam.css'
        }),
        new CopyWebpackPlugin([
          {
            from: path.resolve(SRC_DIR, 'img'),
            to: path.resolve(PUB_DIR, 'img')
          }
        ]),
        new webpack.ProgressPlugin(),
      ]
    },
    modeConfig(mode),
    presetConfig({ mode, presets })
  );
};