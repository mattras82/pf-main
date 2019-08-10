// HELPERS
const path = require('path');
const merge = require('webpack-merge');
const notifier = require('node-notifier');

try {
  // CONFIG OBJECTS
  const stat = require('../pf-parent-theme/build/config/static');
  const admin = require('../pf-parent-theme/build/config/admin');
  const theme = require('../pf-parent-theme/build/config/theme');

// UTIL CONFIG OPTIONS
  const production = require('../pf-parent-theme/build/util/production');
  const scripts = require('../pf-parent-theme/build/util/scripts');
  const styles = require('../pf-parent-theme/build/util/styles');

// PLUGINS
  const ConfigBuild = require('../pf-parent-theme/build/config-build');

  module.exports = (env, argv) => {
    let build = [];

    const base = {
      node: {
        __dirname: true,
        __filename: true
      },
      output: {
        path: path.resolve(__dirname, 'assets'),
        filename: '[name].js',
      },
      plugins: [
        new ConfigBuild(),
      ],
      resolve: {
        modules: [
          path.resolve(__dirname, 'node_modules')
        ],
        alias: {
          "config": './config/config'
        }
      }
    };

    build.push(base);

    // Task without a valid entry, so use a dummy file.
    if (env && (env.static || env.setup)) {
      base.entry = {
        'dummy' : '../pf-parent-theme/build/dummy.js'
      };
    }

    if (!env || env.setup || env.admin || env.theme) {
      build.push(scripts);
      build.push(styles);
    }

    if (env && (env.static || env.setup)) build.push(stat);
    if (env && env.admin) build.push(admin);
    if (!env || env.theme) build.push(theme);

    if (argv.mode === 'production') {
      build.push(production);
    }

    build = build.map(item => {
      if (typeof item === 'function') {
        return item(env, argv, __dirname);
      }
      return item;
    });

    return merge(...build);
  };

} catch(e) {
  notifier.notify({
    title: 'Error: Missing Build Files',
    message: `It looks like you're missing the PF Parent Theme code files. Please download the pf-parent-theme theme directory.`,
    icon: path.join(__dirname, '_src/images/icon.png'),
    wait: true,
    timeout: 10
  });
  console.log(e);
  module.exports = {
    output: {
      path: path.resolve(__dirname, 'assets'),
    }
  };
}
