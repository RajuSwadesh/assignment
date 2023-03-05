/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import TouchID from 'react-native-touch-id';

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

const Setting = ({navigation}) => {
  const [switchOn, setSwitchOn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userPassword, setUserPassword] = useState(null);
  const [docId, setDocId] = useState(null);
  let userStatus = useRef();
  let enableFingerPrint = useRef(false);

  useEffect(() => {
    auth().onAuthStateChanged(async user => {
      if (user.uid) {
        userStatus.current = user?.uid;
        getUserData();
      }
    });
  }, []);
  useEffect(() => {
    if (switchOn) {
      if (enableFingerPrint.current === false) {
        TouchID.isSupported(optionalConfigObject)
          .then(biometryType => {
            // Success code
            if (biometryType) {
              touchHandler();
            } else {
              console.log('TouchID is supported.');
            }
          })
          .catch(error => {
            // Failure code
            console.log('error', error);
          });
      }
    }
  }, [switchOn]);

  const getUserData = () => {
    firestore().collection('users').onSnapshot(onResult, onError);
  };

  const touchHandler = () => {
    console.log('touch');
    TouchID.authenticate('Please touch sensor', optionalConfigObject)
      .then(res => {
        console.log('success', res);
        console.log('userName', userName);
        console.log('userPassword', userPassword);
        if (res) {
          Keychain.setGenericPassword(userName, userPassword)
            .then(resp => {
              console.log('keychain success set', resp);
              firestore()
                .collection('users')
                .doc(docId)
                .update({
                  fingerprint: resp?.storage,
                })
                .then(() => {
                  console.log('User updated!');
                  Alert.alert('Success', 'Fingerprint set sucessfully', [
                    {
                      text: 'OK',
                    },
                  ]);
                });
            })
            .catch(err => {
              console.log('keychain fail set', err);
            });
        }
        //   AlertIOS.alert('Authenticated Successfully');
      })
      .catch(error => {
        console.log('error', error);
        //   AlertIOS.alert('Authentication Failed');
        Alert.alert('Warning', 'Authentication Failed!', [
          {
            text: 'OK',
          },
        ]);
      });
  };

  const onResult = QuerySnapshot => {
    QuerySnapshot.forEach(documentSnapshot => {
      console.log(documentSnapshot.data());
      if (documentSnapshot.data()?.uid === userStatus.current) {
        console.log('data', documentSnapshot.data());
        setDocId(documentSnapshot.id);
        setUserName(documentSnapshot.data()?.email);
        setUserPassword(documentSnapshot.data()?.password);
        setSwitchOn(documentSnapshot.data()?.fingerprint ? true : false);
        enableFingerPrint.current = documentSnapshot.data()?.fingerprint
          ? true
          : false;
      }
    });
  };

  console.log('userName', userName);

  const onError = error => {
    console.error('error', error);
  };

  const removeFingerPrint = () => {
    Keychain.resetGenericPassword()
      .then(resp => {
        console.log('reset is done', resp);
        if (resp) {
          firestore()
            .collection('users')
            .doc(docId)
            .update({
              fingerprint: '',
            })
            .then(res => {
              console.log('reset done', res);
              setSwitchOn(false);
            });
        }
      })
      .catch(err => {
        console.log('err is done', err);
      });
  };
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeAreaView}>
        <View
          style={{
            flexDirection: 'row',
            // paddingHorizontal: 5,
            padding: 8,
            backgroundColor: 'rgb(93, 95, 222)',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgb(93, 95, 222)',
          }}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Pressable onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/images/back.png')}
                style={{width: 30, height: 30, transform: [{rotate: '180deg'}]}}
              />
            </Pressable>
            <Text
              style={{
                paddingLeft: 10,
                color: '#fff',
                textTransform: 'uppercase',
              }}>
              Setting
            </Text>
          </View>
        </View>
        <View style={styles.finerPrint}>
          <Text style={{flex: 1, paddingLeft: 20, color: '#fff'}}>
            Enable Finger Print
          </Text>
          <Switch
            value={switchOn}
            onValueChange={resp => {
              setSwitchOn(!switchOn);
              console.log('switchOn', resp);
                if (resp === false) {
                  removeFingerPrint();
                }
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#000000',
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  finerPrint: {
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    flexDirection: 'row',
    // justifyContent: 'space-around',
    backgroundColor: 'rgba(235, 235, 245, 0.6)',
  },
});
