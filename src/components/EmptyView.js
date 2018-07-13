import React from 'react';
import { TouchableWithoutFeedback, View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class extends React.Component {
    static propTypes = {
        image: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
        onPress: PropTypes.func,
    };

    _renderView = () => {
        return (
            <View style={styles.view}>
                <Image source={this.props.image} style={styles.image} />
                <Text style={styles.text}>
                    {this.props.text}
                </Text>
            </View>
        );
    };

    render() {
        const view = this._renderView();
        return this.props.onPress ? (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                {view}
            </TouchableWithoutFeedback>
        ) : view;
    }
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 152,
    },
    image: {
        width: 70,
        height: 70,
    },
    text: {
        fontSize: 12,
        color: "#aaaaaa"
    },
});