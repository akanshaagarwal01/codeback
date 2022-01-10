import { ActionDispatcher } from '@framework/actions/BaseAction';
import codePush, { LocalPackage, RemotePackage, SyncOptions, CodePushOptions} from 'react-native-code-push';
export class CodePushManager {

    private static readonly DEFAULT_RESTART_BG_TIME = 0;
    private metaData: Promise<LocalPackage | null> | undefined;
    private static readonly KEY_LOCAL_PACKAGE_VERSION = 'localJsBundleVersion';

    constructor() {
        this.metaData = this.initCodePushMetaData();
    }

    private async initCodePushMetaData(): Promise<LocalPackage | null> {
        return codePush.getUpdateMetadata();
    }

    public async getJsBundleVersion(): Promise<string | null> {
        const md = await this.metaData;
        return md?.label ?? null;
    }

    public getCodePushRootComponent(rootComponent: any): any {
        return codePush(this.getCodePushOptions())(rootComponent);
    }

    public reloadJSBundle() {
        codePush.restartApp();
    }

    private getCodePushOptions(): CodePushOptions {
        return {
            checkFrequency: codePush.CheckFrequency.MANUAL
        }
    }

    public async getDeploymentKeyFromAsyncStorage() {
        return AsyncStorageCache.getValue('DEPLOYMENT_KEY');
    }

    public async setDeploymentKeyAndupdate(actionDispatcher: ActionDispatcher, deploymentKey: string) {
        AsyncStorageCache.setValue('DEPLOYMENT_KEY', deploymentKey).then(() => {
            this.checkForUpdate(actionDispatcher, deploymentKey);
        })
    }

    public async clearDeploymentKeyAndUpdate(actionDispatcher?: ActionDispatcher) {
        AsyncStorageCache.removeValue('DEPLOYMENT_KEY').then(() => {
            this.checkForUpdate(actionDispatcher);
        })
    }

    private async isUpdateRequired(remotePackage: RemotePackage): Promise<boolean> {
        const localPagage = await codePush.getUpdateMetadata();
        if (!localPagage) {
            const { description } = remotePackage;
            if (description && !isNaN(parseInt(description, 10))) {
                const removeNativeVersion = parseInt(description, 10);
                const userAgentInfo = getUserAgent();
                const nativeVersion = parseInt(userAgentInfo.appCode, 10);
                return Promise.resolve(nativeVersion < removeNativeVersion);
            }
        }
        return Promise.resolve(true);
    }

    public async checkForUpdate(actionDispatcher: ActionDispatcher, deploymentKey?: string) {
        const finalDeploymentKey = deploymentKey || await this.getDeploymentKeyFromAsyncStorage();

        codePush.checkForUpdate(finalDeploymentKey).then((remotePackage: RemotePackage) => {
            if (remotePackage) {
                this.isUpdateRequired(remotePackage).then((required) => {
                    if (required) {
                        if (remotePackage.isMandatory) {
                            codePush.allowRestart();
                            if (actionDispatcher) {
                                this.updateImmediate(actionDispatcher, finalDeploymentKey);
                            }
                        } else {
                            this.syncApp(remotePackage);
                        }
                    }
                })
            }
        })
    }

    private updateImmediate(actionDispatcher: ActionDispatcher, deploymentKey?: string): void {
        this.showPopupForMandatoryUpdate(actionDispatcher);
        const syncOptions: SyncOptions = {
            deploymentKey,
            installMode: codePush.InstallMode.IMMEDIATE
        }

        codePush.sync(syncOptions).then((syncStatus: codePush.SyncStatus) => {
            if (syncStatus === codePush.SyncStatus.UPDATE_INSTALLED) {}
        })
    }

    public showPopupForMandatoryUpdate(actionDispatcher: ActionDispatcher) {
        const popupPayload: PopupActionPayload = {
            content: this.getUpdateDialogView(),
            modalState: ModalState.OPEN,
            actionDispatcher,
            onClose: () => {}
        }

        const action = {
            type: ActionTypes.OPEN_POP_UP,
            payload: {
                data: popupPayload
            }
        };

        actionDispatcher(action);
    }

    private getUpdateDialogView() {
        return <UpdateDialog />;
    }

    private syncApp(remotePackage: RemotePackage): void {
        if (!remotePackage.isPending) {
            remotePackage.download().then((localPackage: LocalPackage) => {
                localPackage
                    .install(codePush.InstallMode.ON_NEXT_RESUME, CodePushManager.DEFAULT_RESTART_BG_TIME)
                    .then(() => {

                    })
                    .catch(() => {

                    })
            })
        }
    }
}

export default new CodePushManager();
