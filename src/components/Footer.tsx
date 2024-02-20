import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import ListViewConfig from './ListViewConfig';

export enum FooterType {
    lookmore = 'lookmore', // 查看更多
    loading = 'loading', // 加载中
    nomore = 'nomore', // 已经到底了
    nothing = 'nothing', // 空视图
};

export const FooterHeight = 48;

export interface FooterProps {
    type: FooterType;
    onPress: () => void, // 点击事件回调
    lookmoreView: React.ReactNode, // 查看更多视图
    loadingView: React.ReactNode, // 加载中视图
    nomoreView: React.ReactNode, // 已经到底视图
    nothingView: React.ReactNode, // 空视图
    customLookMoreStyle: {
        view: ViewStyle,
        text: TextStyle,
    },
    customLoadingStyle: {
        view: ViewStyle,
        text: TextStyle,
    }
    customNoMoreStyle: {
        view: ViewStyle,
        text: TextStyle,
    }
}

export default class extends React.Component<FooterProps> {
    static defaultProps = {
        type: FooterType.nothing,
    }

    _renderLoadMore = () => {
        const { onPress, customLookMoreStyle } = this.props;
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={[styles.loadmoreview, customLookMoreStyle?.view]}>
                    <Text style={[styles.loadmoretext, customLookMoreStyle?.text]}>
                        {ListViewConfig.ShowmoreText}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    _renderLoading = () => {
        const { customLoadingStyle } = this.props;
        return (
            <View style={[styles.loadingview, customLoadingStyle?.view]}>
                <ActivityIndicator size="small"/>
                <Text style={[styles.loadingtext, customLoadingStyle?.text]}>
                    {ListViewConfig.LoadingText}
                </Text>
            </View>
        );
    };

    _renderNoMore = () => {
        const { customNoMoreStyle } = this.props;
        return (
            <View style={[styles.nomoreview, customNoMoreStyle?.view]}>
                <Text style={[styles.nomoretext, customNoMoreStyle?.text]}>
                    {ListViewConfig.NomoreText}
                </Text>
            </View>
        );
    };

    render() {
        const { type } = this.props;
        if (type === FooterType.lookmore) {
            return this.props.lookmoreView !== undefined ? this.props.lookmoreView : this._renderLoadMore();
        } else if (type === FooterType.loading) {
            return this.props.loadingView !== undefined ? this.props.loadingView : this._renderLoading();
        } else if (type === FooterType.nomore) {
            return this.props.nomoreView !== undefined ? this.props.nomoreView : this._renderNoMore();
        } else {
            return this.props.nothingView !== undefined ? this.props.nothingView : null;
        }
    }
}

const styles = StyleSheet.create({
    loadmoreview: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    loadmoretext: {
        fontSize: 12,
        color: '#bbb',
    },
    loadingview: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: FooterHeight,
        backgroundColor: 'white',
    },
    loadingtext: {
        fontSize: 15,
        color: 'black',
    },
    nomoreview: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: FooterHeight,
        backgroundColor: 'white',
    },
    nomoretext: {
        fontSize: 15,
        color: 'black',
    },
});
