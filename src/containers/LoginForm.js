import React from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet } from 'react-native'
import { View } from 'react-native-animatable'

import CustomButton from './../components/CustomButton'
import CustomTextInput from './../components/CustomTextInput'

import imgAccount from './../images/baseline_account_box_black_18dp.png'
import imgLock from './../images/baseline_lock_black_18dp.png'

import metrics from './../config/metrics'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.DEVICE_WIDTH * 0.1,
  },
  form: {
    marginTop: 20,
  },
  footer: {
    height: 100,
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  loginButtonText: {
    color: '#3E464D',
    fontWeight: 'bold',
  },
  error: {
    color: 'darkred',
    alignContent: 'center',
  }
})

const LoginForm = React.forwardRef(({ isLoading, isLoginError, onLoginPress, username, password, setUsername, setPassword, }, ref) =>
  <View style={styles.container}>
    {isLoginError && <View><Text style={styles.error}>Unable to Login to Aussie Broadband</Text></View>}
    <View style={styles.form} ref={(ref) => { this.formRef = ref }}>
      <CustomTextInput
        name={'username'}
        image={imgAccount}
        ref={(ref) => this.usernameInputRef = ref}
        placeholder={'Username'}
        keyboardType={'default'}
        editable={!isLoading}
        returnKeyType={'next'}
        blurOnSubmit={false}
        withRef={true}
        onSubmitEditing={() => this.passwordInputRef.focus()}
        onChangeText={value => setUsername(value)}
        isEnabled={!isLoading}
        isLoginError={isLoginError}
        value={username ? username : null}
        placeholderTextColor={'black'}
        autoFocus={true}
      />
      <CustomTextInput
        name={'password'}
        image={imgLock}
        ref={(ref) => this.passwordInputRef = ref}
        placeholder={'Password'}
        editable={!isLoading}
        returnKeyType={'done'}
        secureTextEntry={true}
        withRef={true}
        onChangeText={value => setPassword(value)}
        isEnabled={!isLoading}
        isLoginError={isLoginError}
        value={password ? password : null}
        placeholderTextColor={'black'}
      />
    </View>
    <View style={styles.footer}>
      <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
        <CustomButton
          onPress={() => onLoginPress(username, password)}
          isEnabled={username && password ? true : false}
          isLoading={isLoading}
          buttonStyle={styles.loginButton}
          textStyle={styles.loginButtonText}
          text={'Log in'}
        />
      </View>
    </View>
  </View>
)

LoginForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onLoginPress: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
}

export default LoginForm