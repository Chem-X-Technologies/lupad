module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '~': './src',
            '@lupad/shared-ui': '../../packages/shared-ui/src',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
