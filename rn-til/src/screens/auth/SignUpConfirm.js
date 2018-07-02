import React from 'react';
import {KeyboardAvoidingView, StyleSheet, ToastAndroid, View} from "react-native";
import {Auth} from 'aws-amplify';
import {Button, Divider, FormInput, FormLabel, FormValidationMessage, Header, Icon} from "react-native-elements";

export class SignUpConfirm extends React.Component {
    static navigationOptions = {
        header: () => (<Header
            placement="left"
            centerComponent={{text: 'Sign up confirm', style: {color: '#fff'}}}
        />)
    };

    constructor() {
        super();
        this.state = {
            code: '',
            error: null,
        }
    }

    _getErrorMessage = (error) => {
        return error === Object(error) ? error.message : error;
    };

    _confirmSignUp = async () => {
        try {
            const username = this.props.navigation.getParam('username', '');
            const password = this.props.navigation.getParam('password', '');
            await Auth.confirmSignUp(username, this.state.code);
            const data = await Auth.signIn(username, password);
            if (data.signInUserSession === null) {
                console.log(`onSignIn::Response#1: ${JSON.stringify(data, null, 2)}`);
                this.props.navigation.navigate('Auth');
            } else {
                this.props.navigation.navigate('App');
            }
        } catch (err) {
            this.setState({error: err});
            console.log(err);
        }
    };

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.viewContainer}>
                <View style={styles.loginContainer}>
                    <FormLabel>Code</FormLabel>
                    <FormInput onChangeText={(code) => this.setState({code})}/>
                    {this.state.error ?
                        <FormValidationMessage>{this._getErrorMessage(this.state.error)}</FormValidationMessage> : null}
                    <Button backgroundColor="#e95f1c" borderRadius={5} title="Confirm!"
                            onPress={this._confirmSignUp}/>

                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    loginContainer: {
        flexGrow: 1,
    },
    divider: {
        marginTop:30
    }
});