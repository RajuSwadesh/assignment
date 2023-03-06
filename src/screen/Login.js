/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import auth from '@react-native-firebase/auth';
const Login = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [presentLoading, setPresentLoading] = useState(false);
  const clickHandler = () => {
    console.log('ok');
    navigation.navigate('sign-up');
  };

  const signInHandler = () => {
    Keyboard.dismiss();
    if (email === null || password === null) {
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
      signIn();
    }
  };

  const signIn = () => {
    setPresentLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
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
      })
      .catch(error => {
        console.log('error', error);
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
        if (error.code === 'auth/wrong-password') {
          console.log('That email address is invalid!');
          Alert.alert(
            'Warning',
            'The password is invalid or the user does not have a password.!',
            [
              {
                text: 'OK',
              },
            ],
          );
        }
        setPresentLoading(false);
      });
  };
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}>
          <View style={styles.loginTextArea}>
            <Text style={styles.title}>Login</Text>
            <View style={{height: 8}} />
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>
          <View style={{height: 32}} />
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
                textContentType="username"
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
              Create an account?
            </Text>
          </View>

          <TouchableOpacity
            onPress={presentLoading === false ? signInHandler : null}>
            <View style={styles.button}>
              <Text style={styles.buttonTitle}>
                {presentLoading ? 'Processing..' : 'Continue'}
              </Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Login;

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
  },
  loginTextArea: {
    alignItems: 'center',
  },
});
