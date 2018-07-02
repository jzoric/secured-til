import React from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import { Auth } from "aws-amplify";

export class AuthLoading extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  _bootstrapAsync = () => {
    Auth.currentAuthenticatedUser()
      .then(data => {this.props.navigation.navigate("App")})
      .catch(err => this.props.navigation.navigate("Auth"));
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
