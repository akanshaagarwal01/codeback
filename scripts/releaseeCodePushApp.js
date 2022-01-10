const { execSync } = require("child_process");
const { getAppName } = require("./helper");

(async function() {
    function releaseCodePush() {
        try {
            const { env, targetVersion } = argv;
            getAppName().then((app) => {
                execSync(`CURRENT_APP=${app} npm run env: env && node scripts/codepush-release.js --targetVersion=${targetVersion} --e=${env}`, {
                    stdio: 'inherit',
                    cwd: process.cwd()
                })
                process.exit(0);
            })
        } catch {
            process.exit(1);
        }
    }
    releaseCodePush();
})();