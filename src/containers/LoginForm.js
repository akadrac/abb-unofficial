import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet } from 'react-native'
import { View } from 'react-native-animatable'

import CustomButton from './../components/CustomButton'
import CustomTextInput from './../components/CustomTextInput'

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
  },
  loginButtonText: {
    color: '#3E464D',
    fontWeight: 'bold',
  },
  error: {
    color: 'darkred',
    alignContent: 'center',
  },
})

export default class LoginForm extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onLoginPress: PropTypes.func.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
  }

  hideForm = async () => {
    if (this.buttonRef && this.formRef) {
      await Promise.all([
        this.buttonRef.zoomOut(200),
        this.formRef.fadeOut(300),
      ])
    }
  }

  render() {
    console.log('LoginForm render')
    const { isLoading, isLoginError, onLoginPress, username, password, setUsername, setPassword, } = this.props
    const isValid = username !== '' && password !== ''

    return (
      <View style={styles.container}>
        {isLoginError && <View><Text style={styles.error}>Unable to Login to Aussie Broadband</Text></View>}
        <View style={styles.form} ref={(ref) => { this.formRef = ref }}>
          <CustomTextInput
            name={'username'}
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
          />
          <CustomTextInput
            name={'password'}
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
          />
        </View>
        <View style={styles.footer}>
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            <CustomButton
              onPress={() => onLoginPress(username, password)}
              isEnabled={isValid}
              isLoading={isLoading}
              buttonStyle={styles.loginButton}
              textStyle={styles.loginButtonText}
              text={'Log In'}
            />
          </View>
        </View>
      </View>
    )
  }
}
