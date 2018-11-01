import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { KeyboardAvoidingView, StyleSheet } from 'react-native'
import { Image, View } from 'react-native-animatable'
import { Constants } from 'expo'

import imgLogo from './../images/logo-new.png'
import metrics from './../config/metrics'

import LoginForm from './LoginForm'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: metrics.DEVICE_WIDTH,
    height: metrics.DEVICE_HEIGHT,
    backgroundColor: '#00b156',
  },
  statusBar: {
    backgroundColor: "#00b156",
    height: Constants.statusBarHeight,
  },
  logoImg: {
    flex: 1,
    width: metrics.DEVICE_WIDTH * 0.8,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  bottom: {
    backgroundColor: '#00b156',
  }
})

export default class AuthScreen extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoginError: PropTypes.bool.isRequired,
    onLoginAnimationCompleted: PropTypes.func.isRequired, // Called at the end of a succesfull login/signup animation
  }

  componentDidUpdate = (prevProps, prevState, snapshot, ) => {
    // If the user has logged/signed up succesfully start the hide animation
    if (this.props.isLoggedIn !== prevProps.isLoggedIn && this.props.isLoggedIn) {
      this._hideAuthScreen()
    }
  }

  _hideAuthScreen = async () => {
    await this.logoImgRef.fadeOut(800)
    // Tell the container (app.js) that the animation has completed
    this.props.onLoginAnimationCompleted()
  }

  render() {
    console.log('AuthScreen render')
    const { isLoading, isLoginError, login, username, password, setUsername, setPassword, } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />      
        <Image
          animation={'bounceIn'}
          duration={1200}
          delay={200}
          ref={(ref) => this.logoImgRef = ref}
          style={styles.logoImg}
          source={imgLogo}
        />
        <KeyboardAvoidingView
          keyboardVerticalOffset={0}
          behavior={'padding'}
          style={styles.bottom}
        >
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            onLoginPress={login}
            isLoading={isLoading}
            isLoginError={isLoginError}
          />
        </KeyboardAvoidingView>
      </View>
    )
  }
}
