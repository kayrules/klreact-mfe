const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("../package.json").dependencies;
const commonConfig = require("./webpack.common");

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "/lifestyle/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "lifestyle",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/bootstrap",
        "./components": "./src/components",
        "./utils": "./src/utils",
        "./redux/store": "./src/redux/store",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "@klreact-mfe/mfe-ui": {
          singleton: true,
        },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
