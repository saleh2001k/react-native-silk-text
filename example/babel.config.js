module.exports = function (api) {
  api.cache(true);

  // The workspace package is resolved straight to its `src` via the
  // `react-native-silk-text-source` export condition (see metro.config.js), so
  // a plain Expo preset is enough to transform both the app and the library
  // source. We intentionally avoid react-native-builder-bob's babel-config here
  // because its include/exclude RegExp `overrides` break Metro's getCacheKey
  // (which calls Babel without a filename) on Expo SDK 56.
  return {
    presets: ['babel-preset-expo'],
  };
};
