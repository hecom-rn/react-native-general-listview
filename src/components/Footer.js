import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import ListViewConfig from './ListViewConfig';

export const FooterType = {
    lookmore: 'lookmore', // 查看更多
    loading: 'loading', // 加载中
    nomore: 'nomore', // 已经到底了
    nothing: 'nothing', // 空视图
};

export const FooterHeight = 48;

export default class extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf(Object.values(FooterType)),
        onPress: PropTypes.func, // 点击事件回调
        lookmoreView: PropTypes.element, // 查看更多视图
        loadingView: PropTypes.element, // 加载中视图
        nomoreView: PropTypes.element, // 已经到底视图
        nothingView: PropTypes.element, // 空视图
    };

    static get defaultProps() {
        return {
            type: FooterType.nothing,
        };
    }

    _renderLoadMore = () => {
        const { onPress } = this.props;
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={styles.loadmoreview}>
                    <Text style={styles.loadmoretext}>
                        {ListViewConfig.ShowmoreText}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    _renderLoading = () => {
        return (
            <View style={styles.loadingview}>
                <ActivityIndicator size="small" />
                <Text style={styles.loadingtext}>
                    {ListViewConfig.LoadingText}
                </Text>
            </View>
        );
    };

    _renderNoMore = () => {
        return (
            <View style={styles.nomoreview}>
                <Text style={styles.nomoretext}>
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