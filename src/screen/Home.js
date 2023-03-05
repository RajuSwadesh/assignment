/* eslint-disable react-native/no-inline-styles */
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const Home = ({navigation}) => {
  let userStatus = useRef();
  const [userName, setUsername] = useState(null);
  useEffect(() => {
    auth().onAuthStateChanged(async user => {
      if (user.uid) {
        userStatus.current = user?.uid;
        firestore().collection('users').onSnapshot(onResult, onError);
      }
    });
  }, []);

  const onResult = QuerySnapshot => {
    QuerySnapshot.forEach(documentSnapshot => {
      console.log(documentSnapshot.data());
      if (documentSnapshot.data()?.uid === userStatus.current) {
        setUsername(
          `${documentSnapshot.data()?.firstName} ${
            documentSnapshot.data()?.lastName
          }`,
        );
      }
    });
  };

  const onError = error => {
    console.error('error', error);
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
            <Image
              source={require('../assets/images/user.png')}
              style={{width: 40, height: 40, borderRadius: 20}}
            />
            <Text style={{paddingLeft: 10, color: '#fff'}}>
              Hello, {userName}
            </Text>
          </View>
          <View>
            <Pressable onPress={() => navigation.navigate('setting')}>
              <Image
                source={require('../assets/images/settings.png')}
                style={{width: 30, height: 30}}
              />
            </Pressable>
          </View>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{color: 'rgba(235, 235, 245, 0.6)', fontSize: 25}}>
            Welcome to Home
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  root: {
    backgroundColor: '#000000',
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
});
