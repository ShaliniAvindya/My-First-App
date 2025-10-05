const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  config.resolver.sourceExts = ['tsx', 'ts', 'js', 'jsx', 'json'];
  return config;
})();