import React from 'react'
import PropTypes from 'prop-types'
import { Platform, View, TouchableNativeFeedback, TouchableOpacity } from 'react-native'

const IS_ANDROID = Platform.OS === 'android'
// ripple and useForeground
const FEATURES_NOT_SUPPORTED = Platform.Version < 23 && !IS_ANDROID

const nativeTouch = ({ rippleBackground, children, style, ...props }) =>
  <TouchableNativeFeedback {...props} background={TouchableNativeFeedback.Ripple(rippleBackground, false)} useForeground={true}>
    <View style={style}>{children}</View>
  </TouchableNativeFeedback>

const reactTouch = ({ children, style, ...props }) =>
  <TouchableOpacity {...props} style={style}>
    {children}
  </TouchableOpacity>

const TouchableView = ({ isRippleDisabled, rippleBackground, children, style, ...props }) =>
  FEATURES_NOT_SUPPORTED || isRippleDisabled ? reactTouch({ children, style, ...props }) : nativeTouch({ children, rippleBackground, style, ...props })

TouchableView.propTypes = {
  isRippleDisabled: PropTypes.bool,
  rippleBackground: PropTypes.string,
  children: PropTypes.any,
}

TouchableView.defaultProps = {
  rippleBackground: 'grey',
}

export default TouchableView