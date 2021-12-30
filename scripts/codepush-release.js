const path = require("path");
const execSync = require("child_process").execSync;
var argv = require('minimist')(process.argv.slice(2));
const appCenterCli = path.resolve(__dirname, '../node_modules/appcenter-cli/bin/appcenter.js');

const getCodePushUserName = () => {
    return (
        execSync('whomami')
            .toString()
            .trim() + 'wetrade'
    );
}

const resolveCodePushOwner = () => {
    return getCodePushUserName();
}

const outputExec = (cmd) => {
    try {
        return execSync(cmd, { stdio: [0 , 1, 2]});
    } catch {
        process.exit(0);
    }
}

const getLatestCodePushLabel = (owner, appName, deploymentType) => {
    try {
        const command = `${appCenterCli} codepush deployment list --app ${owner}/${appName} --output json`;
        const deploymentInfos = execSync(command).toString();
        const [type, releaseInfo] = JSON.parse(deploymentInfos).find((info) => info[0] === deploymentType);

        return [releaseInfo.split('\n')].split(' ')[1];
    } catch(e) {
        process.exit(0);
    }
}

(async function executeScript() {
    const codePushOwner = resolveCodePushOwner();
    outputExec(`${appCenterCli} login --token TOKEN`);

    let cmdRel = `${appCenterCli} codepush release-react \
    --app owner/appname \
    --target-binary-version binaryVersion \
    --entry-file EntryFile \
    --rollout percentage \
    --d codePushDeployment
    `;

    outputExec(cmdRel);
})();