import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Image, } from 'react-native'
import { Constants } from 'expo'

import imgLogo from './../images/logo-new.png'
import metrics from './../config/metrics'

import CustomButton from './../components/CustomButton'

import UsageBlock from './UsageBlock'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'darkgrey',
  },
  statusBar: {
    backgroundColor: "#00b156",
    height: Constants.statusBarHeight,
  },
  top: {
    flex: 2,
    backgroundColor: '#00b156',
    alignItems: 'center',
  },
  logoImg: {
    width: metrics.DEVICE_WIDTH * 0.8,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginVertical: 5,
  },
  center: {
    flex: 8,
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonInstance: {
    width: '50%',
    padding: 5,
  },
  buttonLogout: {
    backgroundColor: 'grey'
  },
  buttonRefresh: {
    backgroundColor: '#00b156',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    height: 40,
  }
})

export default class HomeScreen extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    usage: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }

  // componentDidUpdate = (prevProps, prevState, snapshot, ) => {
  //   if (prevProps.usage == this.props.usage) {

  //   }
  // }

  render() {
    console.log('HomeScreen render')
    const { logout, refresh, usage, isLoading } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <View style={styles.top}>
          <Image
            animation={'bounceIn'}
            duration={1200}
            delay={200}
            ref={(ref) => this.logoImgRef = ref}
            style={styles.logoImg}
            source={imgLogo}
          />
        </View>
        <UsageBlock style={styles.center} usage={usage} />
        <View style={styles.bottom}>
          <View style={styles.buttonInstance}>
            <CustomButton
              text={'Logout'}
              onPress={logout}
              buttonStyle={styles.buttonLogout}
              textStyle={styles.buttonText}
            />
          </View>
          <View style={styles.buttonInstance}>
            <CustomButton
              text={'Refresh'}
              onPress={refresh}
              buttonStyle={styles.buttonRefresh}
              textStyle={styles.buttonText}
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    )
  }
}
