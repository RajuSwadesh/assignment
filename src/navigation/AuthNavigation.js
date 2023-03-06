/* eslint-disable react-native/no-inline-styles */
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useRef, useState} from 'react';
import Login from '../screen/Login';
import SignUp from '../screen/SignUp';
import RootStackNavigation from './RootStackNavigation';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, View} from 'react-native';
import DigitalLogin from '../screen/DigitalLogin';
const AuthNavigation = () => {
  const [presentLoading, setPresentLoading] = useState(true);
  let userStatus = useRef();
  const Stack = createNativeStackNavigator();
  auth().onAuthStateChanged(user => {
    console.log('user', user?.uid);
    userStatus.current = user?.uid;
    console.log('userStatus current', userStatus);
    setPresentLoading(false);
  });
  // auth()
  //   .signOut()
  //   .then(() => console.log('User signed out!'));

  return presentLoading === false ? (
    <Stack.Navigator
      initialRouteName={
        userStatus.current !== undefined
          ? 'RootStackNavigation'
          : 'digital-login'
      }>
      <Stack.Screen
        name="digital-login"
        component={DigitalLogin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="sign-up"
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RootStackNavigation"
        component={RootStackNavigation}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  ) : (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator animating={true} color={'gold'} />
    </View>
  );
};

export default AuthNavigation;
