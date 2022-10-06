const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const deps = require("../package.json").dependencies;

const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "/container/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        lifestyle: `lifestyle@${domain}/lifestyle/remoteEntry.js`,
        auth: `auth@${domain}/auth/remoteEntry.js`,
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
