const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const root = path.resolve(__dirname, '..');
const pak = require('../package.json');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * The library lives one directory up (the workspace root). Instead of the
 * default monorepo helper — whose custom export-condition resolution misbehaves
 * when the package is a *parent* of the Metro project — we watch the root and
 * alias the package name straight to its TypeScript source so edits hot-reload.
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

config.watchFolders = [root];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(root, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;

const upstreamResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === pak.name) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(root, 'src/index.tsx'),
    };
  }
  const resolve = upstreamResolveRequest || context.resolveRequest;
  return resolve(context, moduleName, platform);
};

module.exports = config;
