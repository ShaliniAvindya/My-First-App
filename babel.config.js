module.exports = function(api) {
  api.cache(true);
  return {
    // Use metro-react-native-babel-preset directly to avoid compatibility issues
    // with babel-preset-expo in some dependency trees. Keep nativewind plugin.
    presets: [
      require.resolve('metro-react-native-babel-preset'),
      require.resolve('nativewind/babel'),
    ],
    plugins: [
      require.resolve('react-native-reanimated/plugin'),
      [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
      [require.resolve('@babel/plugin-transform-private-methods'), { loose: true }],
      [require.resolve('@babel/plugin-transform-private-property-in-object'), { loose: true }],
      require.resolve('@babel/plugin-transform-modules-commonjs'),
    ],
  };
};