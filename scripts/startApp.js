const { execSync } = require("child_process");
const path = require("path");
const { getAppName } = require("./helper");

(async function() {
    function startApp() {
        getAppName().then((app) => {
            execSync(`CURRENT_APP=${app} ${path.resolve(__dirname, '../node_modules/.bin/react-native')} start --reset-cache`, {
                stdio: 'inherit',
                cwd: process.cwd()
            })
        })
    }

    startApp();
})();