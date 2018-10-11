import React from 'react';
import { FlatList, SectionList, RefreshControl, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import { SeperatorLine } from 'react-native-hecom-common';
import Footer, { FooterType } from './components/Footer';
import EmptyView from './components/EmptyView';
import ListViewConfig from './components/ListViewConfig';

export default class extends React.Component {
    static propTypes = {
        List: PropTypes.any, // 自定义内部组件，默认是FlatList或SectionList
        isSection: PropTypes.bool, // 是Flat还是Section，默认false
        innerRef: PropTypes.func, // 内部组件的Ref引用
        hasFooter: PropTypes.bool, // 是否有列表底部展示
        hasEmptyView: PropTypes.bool, // 是否有空白页面，默认有
        hasErrorView: PropTypes.bool, // 是否有错误页面，默认有
        showNomoreFooter: PropTypes.bool, // 是否显示已经到底了，默认为true
        canRefresh: PropTypes.bool, // 是否允许下拉刷新
        canLoadMore: PropTypes.bool, // 是否允许加载更多
        maxCount: PropTypes.number, // 最大数量，如果超过，则显示查看更多，默认不开启(-1)
        refreshControl: PropTypes.element, // 自定义下拉刷新组件
        seperatorMarginLeft: PropTypes.number, // 默认分隔线组件的左边距，自定义分隔线不生效
        initialPageNumber: PropTypes.number, // 分页加载数据时的起始页码
        pageSize: PropTypes.number, // 分页加载数据时的页大小
        data: PropTypes.array, // 不分页时展示的数据内容，如果不是undefined，则表示不分页，否则调用onLoadPage加载分页数据
        onLoadPage: PropTypes.func, // 加载指定页面的方法，(pageNumber, pageSize) => ({data, isEnd})
        onPressFooter: PropTypes.func, // 如果列表底部有查看更多，则为其点击事件
        style: PropTypes.any, // 自定义样式
    };

    static get defaultProps() {
        return {
            isSection: false,
            hasFooter: true,
            hasEmptyView: true,
            hasErrorView: true,
            showNomoreFooter: true,
            canRefresh: true,
            canLoadMore: true,
            maxCount: -1,
            seperatorMarginLeft: 0,
            initialPageNumber: 1,
            pageSize: 10,
        };
    }

    constructor(props) {
        super(props);
        this.pageNumber = -1;
        this.state = {
            data: props.data === undefined ? [] :
                props.maxCount >= 0 ? props.data.slice(0, props.maxCount) : props.data,
            isEnd: false,
            isRefreshing: false,
            isLoadingMore: false,
        };
    }

    componentWillMount() {
        if (this.props.data === undefined) {
            InteractionManager.runAfterInteractions(this.refresh);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== undefined) {
            InteractionManager.runAfterInteractions(this.refresh);
        }
    }

    _loadPage = (pageNumber) => {
        let promise;
        if (this.props.data === undefined) {
            if (this.props.onLoadPage) {
                promise = this.props.onLoadPage(pageNumber, this.props.pageSize);
            } else {
                console.error('You need to add an onLoadPage property in GeneralListView');
            }
        } else {
            const data = this.props.data;
            promise = new Promise((resolve) => {
                setTimeout(() => {
                    resolve({data: data, isEnd: true});
                }, 100);
            });
        }
        return promise
            .then(({data, isEnd, isAllData}) => {
                this.pageNumber = pageNumber;
                if (isAllData) {
                    data = [...data];
                } else {
                    if (pageNumber === this.props.initialPageNumber) {
                        data = [...data];
                    } else {
                        data = [...this.state.data, ...data];
                    }
                }
                if (this.props.maxCount >= 0) {
                    data = data.slice(0, this.props.maxCount);
                    isEnd = true;
                }
                return {
                    data: data,
                    isEnd: isEnd,
                };
            });
    };

    refresh = () => {
        if (this.state.isRefreshing || this.state.isLoadingMore) {
            return;
        }
        if (this.pageNumber >= this.props.initialPageNumber) {
            this.setState({isRefreshing: true});
        }
        return this._loadPage(this.props.initialPageNumber)
            .then((state) => {
                this.setState({
                    ...state,
                    isRefreshing: false,
                });
            });
    };

    loadmore = () => {
        if (this.pageNumber < this.props.initialPageNumber || this.state.isEnd ||
            this.state.isRefreshing || this.state.isLoadingMore) {
            return;
        }
        this.setState({isLoadingMore: true});
        return this._loadPage(this.pageNumber + 1)
            .then((state) => {
                this.setState({
                    ...state,
                    isLoadingMore: false,
                });
            });
    };

    _ItemSeparatorComponent = ({highlighted}) => {
        const left = this.props.seperatorMarginLeft;
        if (left < 0) {
            return null;
        } else {
            return (
                <SeperatorLine style={{marginLeft: highlighted ? 0 : left}} />
            );
        }
    };

    _ListFooterComponent = () => {
        if (this.props.hasFooter && this.props.data === undefined) {
            let type = FooterType.nothing;
            if (this.state.isLoadingMore) {
                type = FooterType.loading;
            } else if (this.state.isEnd) {
                if (this.props.maxCount >= 0) {
                    type = FooterType.lookmore;
                } else if (this.props.showNomoreFooter) {
                    type = FooterType.nomore;
                }
            }
            return (
                <Footer
                    type={type}
                    onPress={this.props.onPressFooter}
                    lookmoreView={this.props.canLoadMore ? undefined : null}
                    loadingView={this.props.canLoadMore ? undefined : null}
                    nomoreView={this.props.canLoadMore ? undefined : null}
                />
            );
        } else {
            return null;
        }
    };

    _ListEmptyComponent = () => {
        if (this.pageNumber < this.props.initialPageNumber) {
            return null;
        } else if (this.props.hasErrorView && this.state.error) {
            return (
                <EmptyView
                    image={ListViewConfig.ErrorPageImage}
                    text={ListViewConfig.ErrorPageText}
                    onPress={this.refresh}
                />
            );
        } else {
            return (
                <EmptyView
                    image={ListViewConfig.EmptyPageImage}
                    text={ListViewConfig.EmptyPageText}
                />
            );
        }
    };

    _refreshControl = () => {
        return this.props.refreshControl || (
            <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.refresh}
                tintColor="#fff"
                titleColor="#fff"
                colors={["red", "green", "blue"]}
            />
        );
    };

    render() {
        const List = this.props.List || (this.props.isSection ? SectionList : FlatList);
        const innerProps = {};
        if (this.props.isSection) {
            innerProps.sections = this.state.data;
        } else {
            innerProps.data = this.state.data;
        }
        if (this.props.canLoadMore) {
            innerProps.onEndReachedThreshold = 0.3;
            innerProps.onEndReached = this.loadmore;
        }
        return (
            <List
                ref={ref => {
                    this.innerList = ref;
                    this.props.innerRef && this.props.innerRef(ref);
                }}
                style={this.props.style}
                ItemSeparatorComponent={this._ItemSeparatorComponent}
                ListFooterComponent={this._ListFooterComponent}
                ListEmptyComponent={this.props.hasEmptyView ? this._ListEmptyComponent : undefined}
                refreshControl={this.props.canRefresh ? this._refreshControl() : undefined}
                keyExtractor={(item, index) => String(index)}
                extraData={this.state}
                {...innerProps}
                {...this.props}
            />
        );
    }
}