import React from "react";
import {Keyboard, StyleSheet, ToastAndroid, View} from "react-native";
import {API} from 'aws-amplify';
import uuid from 'uuid-v4';
import {Button, FormInput,FormLabel, Header,FormValidationMessage} from "react-native-elements";
import {appConfig} from "../app-config";

export class NewTil extends React.Component {
    static navigationOptions = {
        header: (<Header
            placement="left"
            leftComponent={{icon: 'create', color: '#fff'}}
            centerComponent={{text: 'New', style: {color: '#fff'}}}
        />)
    };

    constructor() {
        super();
        this.state = {
            desc: '',
            error: false,
            saveInProgress: false,
        };
    }

    _saveItem = async () => {
        this.setState({saveInProgress:true});
        if (this.state.desc.length===0){
            this.setState({error:true,saveInProgress:false});
            return;
        }
        console.log('Trying to save.... ', JSON.stringify(this.state));
        const item = {
            id: uuid(),
            description: this.state.desc
        };
        try{
            await API.post(appConfig.endpoint.name, appConfig.endpoint.basePath, {body: item});
            ToastAndroid.show('Saved!', ToastAndroid.SHORT);
            this._onSaveCleanup();
            this.props.navigation.navigate('AuthLoading');
        }catch (e) {
            ToastAndroid.show('Error!', ToastAndroid.SHORT);
            console.log("ERROR IS:", error);
            this.setState({saveInProgress:false});
        }
    };

    _onSaveCleanup = () => {
        this.setState({desc: '',error:false});
        Keyboard.dismiss();
    };

    render() {
        return (
            <View style={styles.container}>
                <FormLabel>What you learned today...</FormLabel>
                <FormInput  value={this.state.desc}  multiline={true} onChangeText={(desc) => this.setState({desc})}/>
                {this.state.error ? <FormValidationMessage>Can't be empty</FormValidationMessage> : null}
                <Button loading={this.state.saveInProgress} backgroundColor="#0074D9" borderRadius={5}
                        onPress={() => this._saveItem()} title="Save"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        margin: 10,
    },
});