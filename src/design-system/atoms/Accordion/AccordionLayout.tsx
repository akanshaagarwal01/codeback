import * as React from 'react';
import { StyleProp, View, ViewStyle } from "react-native";

export enum AccordionState {
    EXPANDED,
    COLLAPSED
}

export interface AccordionHeaderProps {
    expIndicatorImage?: string;
    colIndicatorImage?: string;
    isShowShadow?: boolean;
    hideIndicator?: boolean;
    getHeader: (currentState: AccordionState, extParams: any) => { view: JSX.Element | undefined; style?: StyleProp<ViewStyle>};
}

export interface AccordionProps {
    isSingleHeader: boolean;
    header: AccordionHeaderProps;
    initialAccordionState?: AccordionState;
    bodyDivider?: any;
    extParams?: any;
    onAccordionStateChange?: (state: AccordionState) => void;
    onLayoutChange?: (state: AccordionState) => void;
    getBody: (state: AccordionState, extParams: any) => JSX.Element | undefined;
}

export interface AccordionViewState {
    initialState?: AccordionState;
    currentState: AccordionState;
}

export default class AccordionLayout extends React.PureComponent<AccordionProps, AccordionViewState> {
    private readonly headerComponentStyle = { flex: 6};
    private readonly indicatorStyle = [ 'flex', 'alignItemCenter', 'justifyContentCenter', {maxWidth: 48}];
    private readonly elevationStyle = ['flexRow', 'elevation', 'whiteBackground'];

    constructor(props: AccordionProps) {
        super(props);
        this.state = {
            currentState: AccordionLayout.
        }
    }

    componentDidUpdate() {
        this.props.onLayoutChange?.(this.state.currentState);
    }

    private getIndicatorView(iconSrc: string, imgSrc?: string) {
        if (imgSrc) {
            <ImageView source={imgSrc} height={12} width={12} aspectRatio="1:1" />
        }
        return <Icon source={iconSrc} size={'medium'} />
    }

    private getHeaderView(currentState: AccordionState): JSX.Element {
        const { isSingleHeader, extParams, header } = this.props;
        let headerView: JSX.Element | undefined;
        const showBackgroundColor = !(header.colIndicatorImage || header.expIndicatorImage);
        const indicatorColor = showBackgroundColor ? { backgroundColor: 'grey20'} : undefined;
        
        if (isSingleHeader) {
            const headerStyle = header.getHeader(currentState, extParams);
            headerView = (
                <View style={[header.isShowShadow ? this.elevationStyle : 'flexRow', headerStyle.style]}>
                    <View style={this.headerComponentStyle}>{headerStyle.view}</View>
                    {!header.hideIndicator && (
                        <View>
                            {currentState === AccordionState.COLLAPSED ? this.getIndicatorView('plus', header.colIndicatorImage): this.getIndicatorView('minus', header.expIndicatorImage)}
                        </View>
                    )}
                </View>
            );
        } else {
            headerView = header.getHeader(currentState, extParams).view;
        }

        return <Tappable onPress={this.handleHeaderClick}>{headerView}</Tappable>;
    }

    setAccordionState(newState: AccordionState) {
        this.setState({
            currentState: newState
        })
    }

    static getDerivedStateFromProps(nextProps: AccordionProps, prevState: AccordionViewState) {
        if (!prevState || nextProps.initialAccordionState !== prevState?.initialState) {
            return {
                initialState: nextProps.initialAccordionState,
                currentState: AccordionLayout.getAccordionStateFromProps(nextProps)
            }
        }
        return null;
    }

    private static getAccordionStateFromProps(accProps: AccordionProps): AccordionState {
        return accProps.initialAccordionState ? accProps.initialAccordionState : AccordionState.EXPANDED;
    }

    private handleHeaderClick = (_: any) => {
        const newState = this.state.currentState === AccordionState.COLLAPSED ? { currentState: AccordionState.EXPANDED} : {currentState: AccordionState.COLLAPSED}
        this.setState(newState);
        this.props.onAccordionStateChange?.(newState.currentState);
    }

    render() {
        const isShowBody = this.state.currentState === AccordionState.EXPANDED;
        return (
            <View>
                {this.getHeaderView(this.state.currentState)}
                {isShowBody && this.props.bodyDivider && <Divider divider={this.props.bodyDivider} />}
                {isShowBody ? this.props.getBody(AccordionState.EXPANDED, this.props.extParams) : undefined}
            </View>
        );
    }
}