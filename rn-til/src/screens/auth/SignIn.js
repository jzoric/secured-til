import React from 'react';
import {Image, KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import {Auth} from 'aws-amplify';
import {Button, Divider, FormInput, FormLabel, FormValidationMessage, Header} from "react-native-elements";
import Expo from 'expo';

export class SignIn extends React.Component {
    static navigationOptions = {
        header: (<Header
            placement="left"
            leftComponent={{icon: 'account-circle', color: '#fff'}}
            centerComponent={{text: 'Sign in', style: {color: '#fff'}}}
        />)
    };

    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            error: null,
            isAuthenticating: false,
        }
    }

    _getErrorMessage = (error) => {
        return error === Object(error) ? error.message : error;
    };

    _signUp = () => {
        this.props.navigation.navigate('SignUp');
    };

    _googleSignIn = async () => {
        try {
            const result = await Expo.Google.logInAsync({
              androidClientId: "GOOGLE_CLIENT_ID",
              scopes: ['profile', 'email'],
            });

            const {user,idToken} = result;
    
            if (result.type === 'success') {
                try {
                    await Auth.federatedSignIn('google', {token: idToken,},user);
                    this.props.navigation.navigate('App');
                }catch (e) {
                    this.setState({error: "Access denied!", isAuthenticating:false});
                    console.log(e);
                }

            } else {
              return {cancelled: true};
            }
          } catch(e) {
            this.setState({error: e, isAuthenticating:false});
          }
    };
    _signInAsync = async () => {
        try {
            this.setState({isAuthenticating:true});
            const data = await Auth.signIn(this.state.username,this.state.password);
            if (data.signInUserSession === null){
                console.log(`onSignIn::Response#1: ${JSON.stringify(data, null, 2)}`);
                this.props.navigation.navigate('Auth');
            }else{
                this.props.navigation.navigate('App');
            }
        }catch (err) {
            this.setState({error: err, isAuthenticating:false});
            console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        }
    };

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.viewContainer}>
                <View style={styles.loginContainer}>
                    <Image resizeMode="contain" style={styles.logo} source={require('../../../app-icon.png')} />
                </View>
                <View style={styles.formContainer}>
                    <FormLabel>Email</FormLabel>
                    <FormInput autoCapitalize="none" onChangeText={(username) => this.setState({username})}/>
                    <FormLabel>Password</FormLabel>
                    <FormInput secureTextEntry={true} onChangeText={(password) => this.setState({password})}/>
                    {this.state.error ? <FormValidationMessage>{this._getErrorMessage(this.state.error)}</FormValidationMessage> : null}
                    <Button loading={this.state.isAuthenticating} backgroundColor="#0074D9" borderRadius={5} title="Sign in!" onPress={this._signInAsync}/>
                    <Divider style={styles.divider}/>
                    <Button backgroundColor="#D84B37" borderRadius={5} title="Google Sign In!" onPress={this._googleSignIn}/>
                    <Divider style={styles.divider}/>
                    <Text style={styles.signUp} onPress={this._signUp}>
                        Sign up!
                    </Text>
                </View>
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    loginContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    formContainer:{
        flexGrow: 1,
    },
    signUp: {
        color: '#e95f1c',
        alignSelf: 'center',
        fontSize: 16,
        marginTop: 30
    },
    logo: {
        position: 'absolute',
        width: 170,
    },
    divider: {
        marginTop:10
    }
});