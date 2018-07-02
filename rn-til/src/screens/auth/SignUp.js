import React from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from "react-native";
import {Button, FormInput, FormLabel, FormValidationMessage, Header, Icon} from "react-native-elements";
import {Auth} from "aws-amplify";

export class SignUp extends React.Component {
    static navigationOptions = {
        header: ({navigation}) => (<Header
            placement="left"
            leftComponent={<Icon onPress={()=>navigation.goBack(null)} name="arrow-back"/> }
            centerComponent={{text: 'Sign up', style: {color: '#fff'}}}
        />)
    };

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            nickname:'',
            error: null,
        }
    }

    _getErrorMessage = (error) => {
        return error === Object(error) ? error.message : error;
    };

    _signUp = async () => {
        try {
            await Auth.signUp({
                username: this.state.username,
                password: this.state.password,
                attributes:{nickname:this.state.nickname},
            });
            this.props.navigation.navigate('SignUpConfirm',{username: this.state.username, password: this.state.password});
        } catch (err) {
            this.setState({error: err});
            console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        }
    };

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.viewContainer}>
                <View style={styles.loginContainer}>
                    <FormLabel>Email</FormLabel>
                    <FormInput autoCapitalize="none" onChangeText={(username) => this.setState({username})}/>
                    <FormLabel>Password</FormLabel>
                    <FormInput secureTextEntry={true} onChangeText={(password) => this.setState({password})}/>
                    <FormLabel>Nickname</FormLabel>
                    <FormInput onChangeText={(nickname) => this.setState({nickname})}/>
                    {this.state.error ?
                        <FormValidationMessage>{this._getErrorMessage(this.state.error)}</FormValidationMessage> : null}
                    <Button backgroundColor="#0074D9" borderRadius={5} title="Sign up!"
                            onPress={this._signUp}/>
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