/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    View,
    ActivityIndicator,
  } from 'react-native';
const Loader = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator animating={true} color={'rgb(93, 95, 222)'} />
    </View>
  );
};

export default Loader;
