// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Workaround for libraries that rely on Node exports resolution (e.g., supabase-js)
config.resolver.unstable_enablePackageExports = false;

// Alias native-only maps to a web stub when bundling for web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      filePath: require('path').join(__dirname, 'stubs/react-native-maps.web.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;


