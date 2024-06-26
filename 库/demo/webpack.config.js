import { resolve as _resolve } from "path";
import { WebpackOptionsNormalized } from "webpack";

/**
 * @type {WebpackOptionsNormalized}
 */
const config = {
  // 环境: development production
  mode: "production",
  // 入口文件
  entry: "./src/index.ts",
  output: {
    path: _resolve(__dirname, "dist"),
    // 输出的文件名
    filename: "index.js",
    // 注册的全局变量名
    library: "demo",
    // 尝试把库暴露给前使用的模块定义系统，这使其和CommonJS、AMD兼容或者暴露为全局变量
    libraryTarget: "umd",
    // 每次build前自动清理输出的目录
    clean: true,
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        //官方TSloader
        use: "ts-loader",
        //不处理node_modules下面的
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    // 自动解析的文件扩展名
    extensions: [".tsx", ".ts", ".js"],
  },
};

export default config;
