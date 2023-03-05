/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import TouchID from 'react-native-touch-id';

const BioMetricLogin = () => {
  const optionalConfigObject = {
    title: 'Authentication Required', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };

  useEffect(() => {
    checkAvailable();
  }, []);

  const checkAvailable = () => {
    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        // Success code
        if (biometryType === 'FaceID') {
          console.log('FaceID is supported.');
        } else {
          console.log('TouchID is supported.');
        }
      })
      .catch(error => {
        // Failure code
        console.log('error', error);
      });
  };

  const touchHandler = () => {
    console.log('touch');
    TouchID.authenticate(
      'to demo this react-native component',
      optionalConfigObject,
    )
      .then(res => {
        console.log('success', res);
        //   AlertIOS.alert('Authenticated Successfully');
      })
      .catch(error => {
        console.log('error', error);
        //   AlertIOS.alert('Authentication Failed');
      });
  };
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text style={styles.title}>Login</Text>
          <View style={{height: 8}} />
          <Text style={styles.subtitle}>Touch the fingerprint sensor</Text>
          <TouchableHighlight onPress={touchHandler}>
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
          </TouchableHighlight>
          {/* <Text style={styles.text}>or</Text> */}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default BioMetricLogin;
const styles = StyleSheet.create({
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
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    textAlign: 'center',
  },
});
