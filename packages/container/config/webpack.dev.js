const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const deps = require("../package.json").dependencies;

const baseURL = `http://localhost`;
const port = 8080;

const devConfig = {
  mode: "development",
  output: {
    publicPath: `${baseURL}:${port}/`,
  },
  devServer: {
    port,
    historyApiFallback: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        lifestyle: `lifestyle@${baseURL}:8081/remoteEntry.js`,
        auth: `auth@${baseURL}:8082/remoteEntry.js`,
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
          singleton: true
        },
      },
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
