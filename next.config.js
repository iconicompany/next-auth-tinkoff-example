const nextConfig = {};
if (process.env.BASEPATH) {
  nextConfig.basePath = process.env.BASEPATH;
  nextConfig.assetPrefix = process.env.BASEPATH;
}

module.exports = nextConfig;
