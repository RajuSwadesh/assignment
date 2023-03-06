/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TouchID from 'react-native-touch-id';
import * as Keychain from 'react-native-keychain';
import auth from '@react-native-firebase/auth';
import Loader from '../utility/Loader';

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

const DigitalLogin = ({navigation}) => {
  const [presentLoading, setPresentLoading] = useState(false);
  const fingerPrintHandler = () => {
    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        // Success code
        if (biometryType) {
          console.log('FaceID is supported.');
          touchHandler();
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
    TouchID.authenticate('Please touch sensor', optionalConfigObject)
      .then(res => {
        console.log('success', res);
        setPresentLoading(true);
        //   AlertIOS.alert('Authenticated Successfully');
        Keychain.getGenericPassword() // Retrieve the credentials from the keychain
          .then(credentials => {
            console.log('credentials', credentials);
            if (credentials !== false) {
              const {username, password} = credentials;
              checkingAuthCredential(username, password);
            } else {
              setPresentLoading(false);
              Alert.alert('Sorry', 'Your fingerprint is not enrolled!', [
                {
                  text: 'OK',
                },
              ]);
            }
          })
          .catch(err => {
            console.l4('err', err);
            setPresentLoading(false);
          });
      })
      .catch(error => {
        console.log('error', error);
        //   AlertIOS.alert('Authentication Failed');
      });
  };

  const checkingAuthCredential = (userName, userPassword) => {
    auth()
      .signInWithEmailAndPassword(userName, userPassword)
      .then(response => {
        console.log('response', response);
        if (response.user) {
          navigation.navigate('RootStackNavigation');
          navigation.reset({
            index: 0,
            routes: [{name: 'RootStackNavigation'}],
          });
        }
        setPresentLoading(false);
      });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeAreaView}>
        {presentLoading === false ? (
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
            <TouchableOpacity onPress={fingerPrintHandler}>
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
        ) : (
          <Loader />
        )}
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
