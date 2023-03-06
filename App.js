/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigation from './src/navigation/AuthNavigation';
import { MenuProvider } from 'react-native-popup-menu';
const App = () => {
  return (
    <SafeAreaProvider>
      {Platform.OS === 'ios' ? (
        <StatusBar barStyle="light-content" />
      ) : (
        <StatusBar backgroundColor={'#000'} barStyle="light-content" />
      )}
      <MenuProvider>
      <NavigationContainer>
        <AuthNavigation />
      </NavigationContainer>
      </MenuProvider>
    </SafeAreaProvider>
  );
};

export default App;
