import { AppRegistry } from 'react-native';
import RootAppComponent from '@common';
import CodePushManager from '@common/codepush/CodePushManager';

const ConsumerApp = CodePushManager.getCodePushRootComponent(RootAppComponent);

AppRegistry.registerComponent('ConsumerApp', () => ConsumerApp);

