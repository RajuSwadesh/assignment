import React, {useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

const SignUp = ({navigation}) => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [presentLoading, setPresentLoading] = useState(false);
  const [image, setImage] = useState(null)

  const clickHandler = () => {
    console.log('ok');
    navigation.navigate('login');
  };

  const signUpHandler = () => {
    Keyboard.dismiss();
    if (
      (firstName === null && lastName === null) ||
      email === null ||
      password === null || image === null
    ) {
      Alert.alert('Warning', 'Fields should not be blank', [
        {
          text: 'OK',
        },
      ]);
    } else if (
      email.match(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      ) === null
    ) {
      Alert.alert('Warning', 'Invalid Email', [
        {
          text: 'OK',
        },
      ]);
    } else {
      signUp();
    }
  };

  const signUp =async () => {
    setPresentLoading(true);
    console.log('email', email);
    console.log('password', password);
    const uploaduri = image
    const fileUpload = uploaduri?.substring(uploaduri.lastIndexOf('/') + 1);
    // firestore()
    //    .catch((e) => console.log('uploading image error => ', e));
    await storage().ref(fileUpload).putFile(image)
  const url =await storage().ref(fileUpload).getDownloadURL();
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        console.log('first res', res);
        // console.log('User account created & signed in!', res?.user?._user?.uid);
        firestore()
          .collection('users')
          .add({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            uid: res?.user?._user?.uid,
            fingerPrint: '',
            image:url
          })
          .then(response => {
            console.log('success', response);
            setPresentLoading(false);
            navigation.navigate('RootStackNavigation');
            navigation.reset({
              index: 0,
              routes: [{name: 'RootStackNavigation'}],
            });
          })
          .catch(error => {
            console.log('second error', error);
            setPresentLoading(false);
          });
      })
      .catch(error => {
        console.log('first error', error);
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          Alert.alert('Warning', 'That email address is already in use!', [
            {
              text: 'OK',
            },
          ]);
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          Alert.alert('Warning', 'That email address is invalid!', [
            {
              text: 'OK',
            },
          ]);
        }
        setPresentLoading(false);
      });
  };
  const onSelectimage = async () => {
    ImagePicker.openPicker({
      cropping: false,
    }).then(image => {
      console.log('image======>', image);
      setImage(image.path)
    });
  }
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}>
          <Text style={styles.title}>Register Form</Text>
          <View style={{height: 8}} />
          <Text style={styles.subtitle}>Sign up to your account</Text>

            <Image style={{height:130,width:130,alignSelf:'center',borderRadius:10,marginTop:10}} source={image ? { uri: image } : require('../assets/images/user.png')} />
        <TouchableOpacity onPress={onSelectimage}>
          <Image style={{height:35,width:35,borderRadius:15,position:'absolute',top:-35,right:100}} source={require('../assets/images/editIcon.png')} />
          {/* <Text style={{color:'red'}}>
            hiiii
          </Text> */}
        </TouchableOpacity>
          <View style={{height: 32}} />
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
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
                onChangeText={e => setEmail(e)}
                autoCapitalize="none"
                autoCompleteType="email"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="emailAddress"
              />
            </View>
          </Pressable>
          <View style={{height: 16}} />
          <Pressable>
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
          </Pressable>
          <View style={{height: 16}} />
          <View style={styles.createAccountContainer}>
            <Text style={styles.textButton} onPress={clickHandler}>
              Have an account?
            </Text>
          </View>

          <TouchableOpacity
            onPress={presentLoading === false ? signUpHandler : null}>
            <View style={styles.button}>
              <Text style={styles.buttonTitle}>
                {presentLoading ? 'processing..' : 'Continue'}
              </Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default SignUp;

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
  textInput: {
    color: '#FFFFFF',
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    textAlign: 'center',
  },
});
