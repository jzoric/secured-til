import {createBottomTabNavigator, createStackNavigator, createSwitchNavigator} from "react-navigation";
import {TilItems} from "./screens/home/TilItems";
import {SignIn} from "./screens/auth/SignIn";
import {NewTil} from "./screens/NewTil";
import {AuthLoading} from "./screens/auth/AuthLoading";
import {Settings} from "./screens/Settings";
import {Icon} from "react-native-elements";
import React from "react";
import {SignUp} from "./screens/auth/SignUp";
import {SignUpConfirm} from "./screens/auth/SignUpConfirm";


const AuthStack = createStackNavigator({SignIn: SignIn, SignUp: SignUp, SignUpConfirm: SignUpConfirm});

const HomeStack = createStackNavigator({
    Home: TilItems,
});

const OtherStack = createStackNavigator({
    New: NewTil
});

const SettingsStack = createStackNavigator({
    Settings: Settings
});

const AppStack = createBottomTabNavigator({
    Home: HomeStack , New: OtherStack, Settings: SettingsStack
}, {
    order: ['Home', 'New', 'Settings'],
    navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
            let iconName;
            if (routeName === 'Home') {
                iconName = 'home';
            } else if (routeName === 'New') {
                iconName = 'create';
            }else {
                iconName = 'account-circle'
            }

            return <Icon name={iconName} color={tintColor}/>;
        },
    }),
    tabBarOptions: {
        activeTintColor: '#e95f1c',
        labelStyle: {
            fontSize: 12,
        },
    }
});

export default createSwitchNavigator(
    {
        AuthLoading: AuthLoading,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
);