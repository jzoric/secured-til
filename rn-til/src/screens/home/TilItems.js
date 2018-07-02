import React from 'react';
import {Header} from "react-native-elements";
import {Alert, FlatList, View} from "react-native";
import {API} from 'aws-amplify';
import {TilItem} from "./TilItem";
import {appConfig} from "../../app-config";

export class TilItems extends React.Component {
    static navigationOptions = {
        header: (<Header
            placement="left"
            leftComponent={{icon: 'home', color: '#fff'}}
            centerComponent={{text: 'Home', style: {color: '#fff'}}}
        />)
    };

    constructor(){
        super();
        this.state = {
            items: [],
            isFetching: false,
        }
    }

    componentDidMount() {
        this._fetchData();
    };

    _fetchData = () => {
        API.get(appConfig.endpoint.name, appConfig.endpoint.basePath,{}).then(items => this.setState({
            items,
            isFetching: false
        })).catch(err => console.log("Can't get data! ", err));
    };

    _onRefresh = () => {
        this.setState({ isFetching: true }, ()=>{
            this._fetchData()
        });
    };

    _onLongPressItem = (id) => {
        Alert.alert(
            'Delete this item?',
            '',
            [
                {text: 'Cancel'},
                {
                    text: 'OK', onPress: () => {
                        API.del(appConfig.endpoint.name, `${appConfig.endpoint.basePath}/${id}`,{})
                            .then(response => this._fetchData())
                            .catch(err => console.log(err))
                    }
                },
            ],
            {cancelable: false}
        )
    };

    _renderItem = ({item}) => (
        <TilItem
            onLongPressItem={() => this._onLongPressItem(item.id)}
            title={item.description}
            created={item.created_at}
        />
    );

    keyExtractor = (item) => item.id;

    render() {
        return (
            <View>
                <FlatList
                    onRefresh={() => this._onRefresh()}
                    data={this.state.items}
                    renderItem={this._renderItem}
                    keyExtractor={this.keyExtractor}
                    refreshing={this.state.isFetching}
                />
            </View>
        );
    }
}
