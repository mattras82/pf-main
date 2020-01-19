module.exports = function(api) {
  api.cache(true);

  const presets = ['@babel/preset-env'];
  const plugins = ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-class-properties'];

  return {
    presets,
    plugins,
  };
};