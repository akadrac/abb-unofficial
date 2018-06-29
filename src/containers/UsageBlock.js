import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, } from 'react-native'

import Text from './../components/CustomText'

const styles = StyleSheet.create({
  usageBlock: {
  },
  row: {
    flexDirection: 'row',
    padding: 5,
  },
  rowItem: {
    width: '50%',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  }
})

const NoLimitBlock = (style, { downloaded, uploaded, averageUsage, endOfPeriod, daysRemaining, updateTime, } ) =>
  <View style={[styles.usageBlock, style]}>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Plan</Text>
      <Text style={styles.rowItem}>Unlimited</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Days Remaining</Text>
      <Text style={styles.rowItem}>{daysRemaining}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Downloaded</Text>
      <Text style={styles.rowItem}>{downloaded} GB</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Uploaded</Text>
      <Text style={styles.rowItem}>{uploaded} GB</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Daily Usage</Text>
      <Text style={styles.rowItem}>{averageUsage} GB</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Month Ending</Text>
      <Text style={styles.rowItem}>{endOfPeriod}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Last Updated</Text>
      <Text style={styles.rowItem}>{updateTime}</Text>
    </View>
  </View>

const LimitedBlock = (style, { downloaded, uploaded, averageUsage, endOfPeriod, averageLeft, limitRemaining, limit, daysRemaining, updateTime, } ) =>
  <View style={[styles.usageBlock, style]}>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Plan Limit</Text>
      <Text style={styles.rowItem}>{limit} GB</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Days Remaining</Text>
      <Text style={styles.rowItem}>{daysRemaining}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Downloaded</Text>
      <Text style={styles.rowItem}>{downloaded} GB</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Uploaded</Text>
      <Text style={styles.rowItem}>{uploaded} GB</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Daily Usage</Text>
      <Text style={styles.rowItem}>{averageUsage} GB</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Daily Limit</Text>
      <Text style={styles.rowItem}>{averageLeft} GB</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Total Left</Text>
      <Text style={styles.rowItem}>{limitRemaining} GB</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Month Ending</Text>
      <Text style={styles.rowItem}>{endOfPeriod}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.rowItem}>Last Updated</Text>
      <Text style={styles.rowItem}>{updateTime}</Text>
    </View>
  </View>

const UsageBlock = ({ style, usage, }) => {
  console.log('UsageBlock render')

  return usage.nolimit ? NoLimitBlock(style, usage) : LimitedBlock(style, usage)
}

UsageBlock.propTypes = {
  usage: PropTypes.object.isRequired,
}

export default UsageBlock
