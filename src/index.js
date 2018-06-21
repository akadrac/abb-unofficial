import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'

import xml2js, { parseString } from 'react-native-xml2js'
import moment from 'moment-timezone'

import R from 'ramda'

import LoadingScreen from './containers/LoadingScreen'
import AuthScreen from './containers/AuthScreen'
import HomeScreen from './containers/HomeScreen'

const getDaysLeft = (day) => {
  let result = getRollover(day)
  return result.diff(moment().startOf('day'), 'days')
}

const getDaysPast = (day) => {
  let result = getRollover(day)
  return result.subtract(1, 'month').diff(moment().startOf('day'), 'days') * -1
}

const getRollover = (day) => {
  let dayOfMonth = moment().format('DD')

  return (dayOfMonth < day) ? moment().startOf('day').add(day - dayOfMonth, 'day') : moment().startOf('day').add(1, 'month').date(day)
}

const formatData = (json) => {
  console.log('formatData')
  const { lastupdated, allowance1_mb, left1, down1, up1, rollover, } = json.usage

  console.log(`${lastupdated} ${allowance1_mb} ${left1} ${down1} ${up1} ${rollover}`)

  let result = {}

  result.lastUpdated = moment.tz(lastupdated, 'Australia/Melbourne')
  result.updateTime = moment().format('h:mm a')
  result.unlimited = (allowance1_mb == 100000000) ? true : false
  result.corp = (allowance1_mb == 0) ? true : false
  result.nolimit = (result.unlimited || result.corp) ? true : false
  result.limit = (result.unlimited) ? -1 : (allowance1_mb == 0) ? -1 : allowance1_mb / 1000
  result.limitRemaining = (result.limit == -1) ? -1 : Math.round((left1 / 1000 / 1000 / 1000) * 100) / 100
  result.downloaded = Math.round((down1 / 1000 / 1000 / 1000) * 100) / 100
  result.uploaded = Math.round((up1 / 1000 / 1000 / 1000) * 100) / 100
  result.daysRemaining = getDaysLeft(rollover)
  result.daysPast = getDaysPast(rollover)
  result.endOfPeriod = getRollover(rollover).format('YYYY-MM-DD')
  result.averageUsage = Math.round(((result.downloaded + result.uploaded) / result.daysPast) * 100) / 100
  result.averageLeft = (result.limit == -1) ? -1 : Math.round((result.limitRemaining / result.daysRemaining) * 100) / 100
  result.percentRemaining = (result.limit == -1) ? -1 : Math.round((result.limitRemaining / result.limit * 100) * 100) / 100

  return result
}

const parseXML = async (xml) => new Promise((resolve, reject) => {
  console.log('parseXML')
  let options = {
    explicitArray: false,
    valueProcessors: [xml2js.processors.parseNumbers]
  }
  parseString(xml, options, (error, result) => (error) ? reject(error) : resolve(result))
})

const getABBXML = async (login_username, login_password) => {
  console.log('getABBXML')
  let usageURL = 'https://my.aussiebroadband.com.au/usage.php?xml=yes'
  let details = { login_username, login_password }
  let body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&')
  let method = 'POST'
  let headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
  let redirect = 'follow'

  let response = await fetch(usageURL, { method, headers, body, redirect, })
  return response.text()
}

const useCache = (lastUpdated) => moment(lastUpdated).add(15, 'm') > moment().tz('Australia/Melbourne') ? true : false

export class App extends Component {
  constructor(props) {
    super(props)
    refresh = this.refresh.bind(this)
    login = this.login.bind(this)
    logout = this.logout.bind(this)
    onLoginAnimationCompleted = this.onLoginAnimationCompleted.bind(this)
    setUsername = this.setUsername.bind(this)
    setPassword = this.setPassword.bind(this)

    this.state = {
      isStarting: true, // delay rendering until storage retrieved
      isAppReady: false, // Has the app completed the login animation?
      isLoggedIn: false, // Is the user authenticated?
      isLoading: false, // Is the user loggingIn/signinUp?
      isLoginError: false, // error occured during login
      username: undefined,
      password: undefined,
      usage: {},
    }
  }

  // this handles both the login and xml parsing (only way to know if the login worked)
  refresh = async () => {
    console.log('refresh')
    this.setState({ isLoading: true })

    const { username, password, usage, } = this.state

    try {
      if (usage && usage.lastUpdated && useCache(usage.lastUpdated)) {
        console.log('using cached data')
      }
      else {
        console.log('getting new data')
        let xml = await getABBXML(username, password)
        let json = await parseXML(xml)
        let data = formatData(json)

        this.setState({ usage: data })
        await AsyncStorage.setItem('usage', JSON.stringify(data))
      }

      this.setState({ isLoggedIn: true, isLoading: false, loginError: false })
    }
    catch (error) {
      console.log(error)
      this.setState({ isLoading: false, isLoginError: true })
    }
  }

  login = async (username, password, ) => {
    console.log('login')
    await AsyncStorage.multiSet([['username', username], ['password', password]])
    console.log(`Storage - Set - ${username}`)
    await this.refresh()
  }

  logout = async () => {
    console.log('logout')
    try {
      console.log(`Storage - Remove`)
      await AsyncStorage.multiRemove(['username', 'password', 'usage'])
      this.setState({ isLoggedIn: false, isAppReady: false, username: undefined, password: undefined })
    } catch (error) {
      console.log('failed to remove items from store')
    }
  }
  
  componentDidMount = async () => {
    console.log('componentDidMount')
    try {
      let result = await AsyncStorage.multiGet(['username', 'password', 'usage'])
      let map = result.map((v, i, a) => R.objOf(a[i][0], a[i][1]))
      let obj = Object.assign({}, ...map)
      if (obj.username != null && obj.password != null) {
        obj.usage = JSON.parse(obj.usage)
        this.setState(obj)
        await this.refresh()
        if (this.state.isLoggedIn) {
          this.setState({ isAppReady: true })
        }
        console.log(`Storage - Get - ${this.state.username}`)
      }
      this.setState({ isStarting: false })
    }
    catch (error) {
      console.log('failed to add items to store')
    }
  }

  onLoginAnimationCompleted = () => this.setState({ isAppReady: true })
  setUsername = username => this.setState({ username })
  setPassword = password => this.setState({ password })

  render() {
    const { login, logout, refresh, onLoginAnimationCompleted, setUsername, setPassword, } = this
    const { isStarting, isAppReady, isLoading, isLoggedIn, isLoginError, username, password, usage } = this.state

    if (isStarting) {
      return (
        <LoadingScreen
        />
      )
    }
    if (isAppReady) {
      return (
        <HomeScreen
          isLoading={isLoading}
          usage={usage}
          refresh={refresh}
          logout={logout}
        />
      )
    }
    return (
      <AuthScreen
        login={login}
        isLoggedIn={isLoggedIn}
        isLoading={isLoading}
        isLoginError={isLoginError}
        username={username}
        password={password}
        onLoginAnimationCompleted={() => onLoginAnimationCompleted(true)}
        setUsername={username => setUsername(username)}
        setPassword={password => setPassword(password)}
      />
    )

  }
}

export default App
