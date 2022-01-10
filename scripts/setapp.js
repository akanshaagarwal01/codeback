const path = require('path');
const fs = require('fs');

if(!process.argv.slice(2)[0]) {
    process.exit(1)
}

const appName = 'appName';

const CONFIG_PATH = path.resolve(__dirname, '../src', 'apps');

const exists = fs.existsSync(`${CONFIG_PATH}/${appName}`);

if (!exists) {
    process.exit(1);
}

const APP_NAME_FILE = path.resolve(__dirname, '../appname.txt');

fs.writeFile(APP_NAME_FILE, appName, errr => {
    require('./generateTheme').generateTheme;
})