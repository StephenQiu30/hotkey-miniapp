import { defineConfig } from "@tarojs/cli";
import path from "node:path";

export default defineConfig({
  projectName: "hotkey-miniapp",
  date: "2026-05-24",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: "dist",
  alias: {
    "@": path.resolve(__dirname, "..", "src"),
  },
  framework: "react",
  compiler: "webpack5",
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false,
      },
    },
  },
});
