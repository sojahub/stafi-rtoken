const path = require("path");
const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  eslint: {
    enable: false,
  },
  webpack: {
    alias: {
      stream: "stream-browserify",
    //   path: false,
    //   fs: false,
      crypto: "crypto-browserify",
      "@components": resolve("src/components"),
      "@images": resolve("src/assets/images"),
      "@features": resolve("src/features"),
      "@servers": resolve("src/servers"),
      "@util": resolve("src/util"),
      "@keyring": resolve("src/keyring"),
      "@config": resolve("src/config"),
      "@shared": resolve("src/shared"),
    },
  },
};
