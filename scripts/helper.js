const fs = require('fs');

function getAppName() {
    return new Promise((resolve, reject) => {
        fs.readFile('appname.txt', 'utf-8', (err, appname) => {
            resolve(appname);
        })
    })
}

module.exports = {
    getAppName
}