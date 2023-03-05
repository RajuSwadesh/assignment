/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const DigitalLogin = ({navigation}) => {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text style={styles.title}>Login</Text>
          <View style={{height: 8}} />
          <Text style={styles.subtitle}>Fast & Secure Login</Text>
          <View style={{alignItems: 'center', paddingVertical: 20}}>
            <Image
              source={require('../assets/images/faceId.png')}
              style={{
                width: '20%',
                height: 65,
                backgroundColor: 'rgba(235, 235, 245, 0.6)',
              }}
            />
          </View>
          <Text style={styles.text}>or</Text>
          <TouchableOpacity onPress={() =>navigation.navigate('Bio-Metric')}>
          <View style={{alignItems: 'center', paddingVertical: 20}}>
            <Image
              source={require('../assets/images/fingerprint.png')}
              style={{
                width: '20%',
                height: 65,
                backgroundColor: 'rgba(235, 235, 245, 0.6)',
              }}
            />
          </View>
          </TouchableOpacity>
          <Text
          onPress={() => navigation.navigate('login')}
            style={[
              styles.text,
              {
                marginLeft: 90,
                marginRight: 90,
                color: 'rgb(93, 95, 222)',
                borderBottomColor: 'rgb(93, 95, 222)',
                borderWidth: 0.4,
              },
            ]}>
            Login With UserName & Password
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default DigitalLogin;
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'rgb(93, 95, 222)',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  createAccountContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  form: {
    alignItems: 'center',
    backgroundColor: 'rgb(58, 58, 60)',
    borderRadius: 8,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 16,
  },
  label: {
    color: 'rgba(235, 235, 245, 0.6)',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    width: 80,
  },
  root: {
    backgroundColor: '#000000',
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  subtitle: {
    color: 'rgba(235, 235, 245, 0.6)',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    textAlign: 'center',
  },
  textButton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
  },
  text: {
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    textAlign: 'center',
  },
  loginTextArea: {
    alignItems: 'center',
  },
});
