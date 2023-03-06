/* eslint-disable react-native/no-inline-styles */
// your entry point
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
// somewhere in your app
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
const Profile = ({navigation}) => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [docId, setDocId] = useState(null);
  const [image, setImage] = useState(null);
  const [uploadImg, setUploadImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  let userStatus = useRef();
  useEffect(() => {
    auth().onAuthStateChanged(async user => {
      if (user.uid) {
        userStatus.current = user?.uid;
        getUserData();
      }
    });
  }, []);
  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = () => {
    firestore().collection('users').onSnapshot(onResult, onError);
  };
  const onResult = QuerySnapshot => {
    QuerySnapshot.forEach(documentSnapshot => {
      console.log(documentSnapshot.data());
      if (documentSnapshot.data()?.uid === userStatus.current) {
        console.log('data', documentSnapshot.data().email);
        setEmail(documentSnapshot.data().email);
        setFirstName(documentSnapshot.data().firstName);
        setLastName(documentSnapshot.data().lastName);
        setImage(documentSnapshot.data().image);

        setDocId(documentSnapshot.id);
      }
    });
  };
  const onError = error => {
    console.error('error', error);
  };
  console.log(docId);
  const updateHandler = async () => {
    setUploading(true);
    console.log('firstName',firstName);
    if (firstName === '' || lastName === '' || image === null) {
      Alert.alert('Warning', 'Fields should not be blank', [
        {
          text: 'OK',
        },
      ]);
    } else {
      let url = '';
      if (uploadImg) {
        const uploaduri = image;
        const fileUpload = uploaduri?.substring(uploaduri.lastIndexOf('/') + 1);
        await storage().ref(fileUpload).putFile(uploaduri);
        url = await storage().ref(fileUpload).getDownloadURL();
      }
      //
      firestore()
        .collection('users')
        .doc(docId)
        .update({
          firstName: firstName,
          lastName: lastName,
          image: uploadImg ? url : image,
        })
        .then(res => {
          console.log(res);
          setUploading(false);
          Alert.alert('Success', 'Profile update sucessfully', [
            {
              text: 'OK',
            },
          ]);
        })
        .catch(err => {
          console.log('err=======>', err);
          setUploading(false);
        });
    }
  };
  const onSelectimage = async () => {
    ImagePicker.openPicker({
      cropping: false,
    }).then(image => {
      //   console.log('image======>', image);
      setImage(image.path);
      setUploadImage(image.path);
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
              Profile
            </Text>
          </View>
        </View>
        <View style={{padding: 15}}>
          <Text style={styles.title}>Profile Details</Text>
          <Image
            style={{
              height: 130,
              width: 130,
              alignSelf: 'center',
              borderRadius: 10,
              marginTop: 10,
            }}
            source={image ? {uri: image} : require('../assets/images/user.png')}
          />
          <TouchableOpacity onPress={onSelectimage}>
            <Image
              style={{
                height: 35,
                width: 35,
                borderRadius: 15,
                position: 'absolute',
                top: -35,
                right: 100,
              }}
              source={require('../assets/images/editIcon.png')}
            />
          </TouchableOpacity>
          <View style={{height: 8}} />
          <View style={{height: 32}} />
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                value={firstName}
                onChangeText={e => setFirstName(e)}
                autoCapitalize="none"
                autoCompleteType="email"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="username"
              />
            </View>
          </Pressable>
          <View style={{height: 16}} />
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                value={lastName}
                onChangeText={e => setLastName(e)}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                style={styles.textInput}
                textContentType="username"
              />
            </View>
          </Pressable>
          <View style={{height: 16}} />
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                // onChangeText={e => setEmail(e)}
                autoCapitalize="none"
                autoCompleteType="email"
                autoCorrect={false}
                editable={false}
                keyboardType="email-address"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="emailAddress"
              />
            </View>
          </Pressable>
          <View style={{height: 16}} />
          {/* <Pressable>
                    <View style={styles.form}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            onChangeText={e => setPassword(e)}
                            autoCapitalize="none"
                            autoCompleteType="password"
                            autoCorrect={false}
                            secureTextEntry
                            style={styles.textInput}
                            textContentType="password"
                        />
                    </View>
                </Pressable> */}
          <View style={{height: 16}} />

          <TouchableOpacity
            onPress={uploading === false ? updateHandler : null}>
            <View style={styles.button}>
              <Text style={styles.buttonTitle}>
                {uploading ? 'Processing..' : 'Update'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    backgroundColor: '#F7F7F7',
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
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
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 16,
  },
  label: {
    color: '#00000',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    width: 80,
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
  textInput: {
    color: '#00000',
    flex: 1,
  },
  title: {
    color: '#00000',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    textAlign: 'center',
    marginTop: 10,
  },
});
export default Profile;
