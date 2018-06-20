
import React, { Component } from 'react'
import { StyleSheet, View, Image, } from 'react-native'

import imgLogo from './../images/logo-new.png'
import metrics from './../config/metrics'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: metrics.DEVICE_WIDTH,
        height: metrics.DEVICE_HEIGHT,
        paddingTop: 24,
        backgroundColor: '#00b156',
    },
    logoImg: {
        flex: 1,
        width: metrics.DEVICE_WIDTH * 0.8,
        alignSelf: 'center',
        resizeMode: 'contain',
        marginVertical: 30,
    },
})

export default class LoadingScreen extends Component {
    render() {
        console.log('LoadingScreen render')
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logoImg}
                    source={imgLogo}
                />
            </View>
        )
    }
}
