import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Platform, StyleSheet, TextInput, Image, } from 'react-native'
import { View } from 'react-native-animatable'

const IS_ANDROID = Platform.OS === 'android'

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputWrapper: {
    flexDirection: 'row',
    height: 42,
    marginBottom: 2,
    borderBottomWidth: 1,
  },
  textInput: {
    flex: 1,
    color: 'white',
    margin: IS_ANDROID ? -1 : 0,
    padding: 7,
  },
  image: {
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
})

class CustomTextInput extends Component {
  static propTypes = {
    isEnabled: PropTypes.bool
  }

  state = {
    isFocused: false
  }

  focus = () => this.textInputRef.focus()

  render () {
    const { isEnabled, isLoginError, image, ...otherProps } = this.props
    const { isFocused } = this.state
    const color = isEnabled ? 'white' : 'rgba(255,255,255,0.4)'
    const borderColor = isFocused ? 'white' : isLoginError ? 'darkred' : 'rgba(255,255,255,0.4)'
    
    return (
      <View style={styles.container}>
        <View style={[styles.textInputWrapper, { borderColor }]}>
          {image && <Image source={image} style={styles.image}/>}
          <TextInput
            ref={(ref) => this.textInputRef = ref}
            autoCapitalize={'none'}
            autoCorrect={false}
            style={[styles.textInput, { color }]}
            maxLength={32}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={'rgba(255,255,255,0.4)'}
            selectionColor={'white'}
            onFocus={() => this.setState({ isFocused: true })}
            onBlur={() => this.setState({ isFocused: false })}
            {...otherProps}
          />
        </View>
      </View>
    )
  }
}

export default CustomTextInput