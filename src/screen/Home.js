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
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import auth from '@react-native-firebase/auth';
import Loader from '../utility/Loader';

const Home = ({navigation}) => {
  let userStatus = useRef();
  const [userName, setUsername] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userList, setUserList] = useState([]);
  const [presentLoading, setPresentLoading] = useState(true);
  useEffect(() => {
    auth().onAuthStateChanged(async user => {
      if (user.uid) {
        userStatus.current = user?.uid;
        firestore()
          .collection('users')
          .orderBy('firstName', 'desc')
          .onSnapshot(onResult, onError);

        const subscriber = firestore()
          .collection('users')
          .onSnapshot(querySnapshot => {
            const users = [];

            querySnapshot.forEach(documentSnapshot => {
              users.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
              setUserList(users);
              setPresentLoading(false);
            });
          });
        return () => subscriber();
      }
    });
    // Unsubscribe from events when no longer in use
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
        setUserImage(documentSnapshot.data()?.image);
      }
    });
  };

  const onError = error => {
    console.error('error', error);
  };
  const logOut = () => {
    console.log('hiiiiii');
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('digital-login');
      });
  };
  const userListCard = ({item}) => {
    return (
      <View style={styles.card}>
        <View style={{flex: 1}}>
          <Image
            source={
              item?.image
                ? {uri: item?.image}
                : require('../assets/images/user.png')
            }
            style={{width: 30, height: 30, borderRadius: 20}}
          />
        </View>
        <View style={{flex: 2}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
            }}>{`${item?.firstName} ${item?.lastName}`}</Text>
          <Text style={{fontSize: 12, fontWeight: '400'}}>{item?.email}</Text>
        </View>
        <View style={{flex: 1}} />
      </View>
    );
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
            <Menu>
              <MenuTrigger>
                <Image
                  source={
                    userImage
                      ? {uri: userImage}
                      : require('../assets/images/user.png')
                  }
                  style={{width: 40, height: 40, borderRadius: 20}}
                />
              </MenuTrigger>
              <MenuOptions style={{padding: 12}}>
                <MenuOption onSelect={() => navigation.navigate('Profile')}>
                  <Text>Profile</Text>
                </MenuOption>
                <MenuOption onSelect={() => logOut()}>
                  <Text>Log Out</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
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
        {presentLoading === false ? (
          <FlatList
            data={userList}
            renderItem={userListCard}
            keyExtractor={item => item?.key}
          />
        ) : (
          <Loader />
        )}
      </SafeAreaView>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  root: {
    backgroundColor: '#F7F7F7',
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    margin: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 5,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
