import React from 'react'
import PropTypes from 'prop-types'
import { ActivityIndicator, StyleSheet, Text } from 'react-native'

import { View } from 'react-native-animatable'

import TouchableView from './TouchableView'

const styles = StyleSheet.create({
  button: {
    height: 42,
    borderWidth: 1,
    borderRadius: 3,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'grey'
  },
  spinner: {
    height: 26,
  },
  text: {
    textAlign: 'center',
    fontWeight: '400',
    color: 'grey',
  },
})

const CustomButton = ({ onPress, isEnabled, isLoading, text, buttonStyle, textStyle, rippleBackground, ...otherProps }) =>
  <View {...otherProps}>
    <TouchableView
      onPress={isEnabled && !isLoading ? onPress : f => f}
      style={[styles.button, buttonStyle]}
      rippleBackground={rippleBackground}
    >
      {isLoading
        ? <ActivityIndicator style={styles.spinner} color={'grey'} />
        : <Text style={[styles.text, textStyle]}>{text}</Text>}
    </TouchableView>
  </View>

CustomButton.propTypes = {
  onPress: PropTypes.func,
  isEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  text: PropTypes.string,
  buttonStyle: PropTypes.any,
  textStyle: PropTypes.any,
  rippleBackground: PropTypes.string,
}

CustomButton.defaultProps = {
  onPress: f => f,
  isEnabled: true,
  isLoading: false,
  rippleBackground: 'grey',
}

export default CustomButton
