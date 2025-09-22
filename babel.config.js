module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['module-resolver', {
        alias: {
          '@src': './src',
        },
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json']
      }]
    ],
  };
};
