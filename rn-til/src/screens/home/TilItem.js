import React from "react";
import {StyleSheet, TouchableNativeFeedback, View} from "react-native";
import {Text} from "react-native-elements";
import moment from 'moment';

export class TilItem extends React.PureComponent {
    _onLongPress = () => {
        this.props.onLongPressItem(this.props.id);
    };

    render() {
        return (
            <TouchableNativeFeedback onLongPress={this._onLongPress}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {this.props.title}
                        </Text>
                    <Text style={styles.created}>{moment(this.props.created).format('DD-MM-YYYY HH:mm')}</Text>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        height: 70,
        padding:5,
    },
    title: {
        paddingLeft: 10,
        fontSize: 22,
    },
    created: {
        paddingLeft: 10,
        fontSize: 12,
        borderBottomColor: '#c7c7c7',
        borderBottomWidth: 1,
    }
});