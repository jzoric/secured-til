import {Keyboard, KeyboardAvoidingView, StyleSheet, ToastAndroid, View} from "react-native";
import React from "react";
import {Auth} from 'aws-amplify';
import {Button, Divider, FormInput, FormLabel, Header} from "react-native-elements";

export class Settings extends React.Component {
    static navigationOptions = {
        header: (<Header
            placement="left"
            leftComponent={{icon: 'account-circle', color: '#fff'}}
            centerComponent={{text: 'Settings', style: {color: '#fff'}}}
        />)
    };

    constructor(props){
        super(props);
        this.state={
            email:'',
            nickname:''
        }
    }

    componentDidMount(){
        Auth.currentAuthenticatedUser().then(data => {
            if (data.attributes){
                this.setState({email: data.attributes.email, nickname:data.attributes.nickname})
            }else {
                this.setState({email: data.email})
            }
        });
    }

    _signOutAsync = async () => {
        try {
            await Auth.signOut();
            this.props.navigation.navigate('Auth');
        }catch (e) {
            ToastAndroid.show("Can't sign out!", ToastAndroid.SHORT);
        }
    };

    _updateProfile = async () => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.updateUserAttributes(currentUser, {nickname: this.state.nickname});
            ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
        }catch (e) {
            ToastAndroid.show("Can't update profile! Try later!", ToastAndroid.SHORT);
        }
        Keyboard.dismiss();
    };

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.viewContainer}>
                <View style={styles.container}>
                    <FormLabel>Email/Username</FormLabel>
                    <FormInput editable={false} value={this.state.email}/>
                    <FormLabel>Nickname</FormLabel>
                    <FormInput focus={true} value={this.state.nickname} onChangeText={(nickname) => this.setState({nickname})}/>
                    <Button backgroundColor="#e95f1c" borderRadius={10} title="Update profile" onPress={this._updateProfile}/>
                    <Divider style={styles.divider}/>
                    <Button backgroundColor="#E90611" borderRadius={10} title="Sign out" onPress={this._signOutAsync}/>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    divider: {
        marginTop:30,
    },
});