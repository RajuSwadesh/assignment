import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Home from '../screen/Home';
import Setting from '../screen/Setting';
import Profile from '../screen/Profile';
const RootStackNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName={'home'}>
      <Stack.Screen
        name="home"
        component={Home}
        options={{
          headerShown: false,
          title: 'Home',
          headerStyle: {backgroundColor: 'golden'},
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          title: 'Profile',
          headerStyle: {backgroundColor: 'golden'},
        }}
      />
      <Stack.Screen
        name="setting"
        component={Setting}
        options={{
          headerShown: false,
          title: 'Home',
          headerStyle: {backgroundColor: 'golden'},
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStackNavigation;
