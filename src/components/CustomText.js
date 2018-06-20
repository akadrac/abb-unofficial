import React from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, } from 'react-native'

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontWeight: '400',
    color: 'white'
  }
})

const CustomText = ({ children, style, ...props }) => <Text style={[styles.text, style]} {...props}>{children}</Text>


CustomText.propTypes = {
  children: PropTypes.any,
  style: Text.propTypes.style
}

export default CustomText