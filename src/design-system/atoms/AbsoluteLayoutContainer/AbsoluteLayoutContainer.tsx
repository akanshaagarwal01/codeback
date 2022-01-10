import * as React from 'react';
import { requireNativeComponent } from 'react-native';

const Container = requireNativeComponent('AbsoluteLayoutContainer');

export class AbsoluteLayoutContainer extends React.Component {
    public render(): React.ReactNode {
        return <Container {...this.props} />
    }
}