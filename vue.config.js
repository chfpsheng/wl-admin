"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");

function resolve(dir) {
  return path.join(__dirname, dir);
}

function getProxyConfig() {
  const config = {};
  for (const key in process.env) {
    if (Object.hasOwnProperty.call(process.env, key)) {
      const envProxyPrefix = "PROXY_CONFIG";
      if (key.startsWith(envProxyPrefix)) {
        const item = process.env[key];
        const splitStr = "-->>";
        const itemConfig = item.split(splitStr);
        const prefix = itemConfig[0].trim();
        const target = itemConfig[1].trim();
        const pathRewrite = prefix.replace(/\/\S+\//g, "/");
        const proxyConfig = {
          target,
          changeOrigin: true,
          pathRewrite: {
            [prefix]: pathRewrite
          }
        };
        config[prefix] = proxyConfig;
      }
    }
  }
  console.log(config);
  return config;
}

const name = defaultSettings.title || "物联网云平台"; // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527; // dev port
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// 定义压缩文件类型
const productionGzipExtensions = ["js", "css"];

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  // lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  css: {
    extract: false, // false热加载
    sourceMap: false,
    loaderOptions: {
      stylus: {
        "resolve url": true,
        // 自定义主题场景
        import: [path.resolve(__dirname, "./src/assets/css/base.styl")]
      }
    }
  },
  devServer: {
    hot: true,
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      ...getProxyConfig(), // 自定义本地开发联调转发
      [process.env.VUE_APP_BASE_API + ""]: {
        //target: `http://vue.ruoyi.vip/prod-api`,
        // target: `http://10.124.130.129:8888`,

        target: `http://10.60.1.210:8888`, //me
        //target: `http://192.168.125.174:8888`,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      },
      "/cloud-*": {
        target: process.env.VUE_APP_BASE_API_PROXY, // 默认转发
        changeOrigin: true
      }
    }
    // before: require("./mock/mock-server.js")
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    plugins: [
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial"
      }
    ]);

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete("prefetch");

    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
  }
};
