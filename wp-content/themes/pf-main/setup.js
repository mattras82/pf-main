const fs = require('fs');
const path = require('path');
const notifier = require('node-notifier');
const webpack = require('webpack');
const lnk = require('lnk');
const child_process = require('child_process');

console.log('checking local setup...');
console.log('-----------------------');

if (fs.existsSync('../pf-parent-theme')) {
  console.log('PF Parent theme is installed.');
} else {
  if (process.argv[2]) {
    try {
      if (process.platform === 'win32') {
        child_process.execSync(`start cmd.exe /K mklink /J %cd%\\..\\pf-parent-theme ${process.argv[2]}`);
      } else {
        lnk.sync(process.argv[2], '../', {rename: 'pf-parent-theme'});
      }
    } catch(e) {
      console.log(e);
      console.log('Oh no! The directory junction to your PF Parent Theme folder could not be generated. :(');
      console.log('Please add the pf-parent-theme theme files manually and re-run this command');
      process.exit(-1);
    }
    console.log('Directory junction has been created.');
  } else {
    notifier.notify({
        title: 'Error: Missing Command Line Argument',
        message: `Please add the full path to the pf-parent-theme theme directory on your machine as a command line argument.`,
        icon: path.join(__dirname, '_src/images/icon.png'),
        wait: true,
        timeout: 10
      },
      function () {
        let example = '/Path/To/Your/pf-wordpress-parent-theme';
        if (process.platform === 'win32') {
          example = 'c:\\\\YOUR\\\\PATH\\\\TO\\\\pf-wordpress-parent-theme';
        }
        console.log(`The command should read \'npm run setup -- \'${example}\'.`);
        process.exit(-1);
      }
    );
    return false;
  }
}

console.log('continuing with WebPack setup routine...');
console.log('----------------------------------------');

let config = require('./webpack.config');
config = config({static: true}, {mode: 'development'}, __dirname);
if (!config.mode) config.mode = 'development';
webpack(config, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  console.log('Your project has been successfully set up. Happy Coding!');
  console.log('You can now run \'npm start\' or \'npm run theme\' to get your theme resources generated.');
  console.log('Happy Coding!');
});
