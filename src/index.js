import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'

import xml2js, { parseString } from 'react-native-xml2js'
import moment from 'moment'
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
  const { lastupdated, allowance1_mb, left1, down1, up1, rollover, } = json.usage

  console.log(`${lastupdated} ${allowance1_mb} ${left1} ${down1} ${up1} ${rollover}`)

  let result = {}

  result.lastUpdated = lastupdated
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
  let options = {
    explicitArray: false,
    valueProcessors: [xml2js.processors.parseNumbers]
  }
  parseString(xml, options, (error, result) => (error) ? reject(error) : resolve(result))
})

const fake = async () => new Promise(resolve => setTimeout(() => resolve(fakeLimited()), 5000))

const fakeUnlimited = () => ({
  lastUpdated: moment().format('YYYY-MM-DD'),
  updateTime: moment().format('h:mm a'),
  unlimited: true,
  corp: false,
  nolimit: true,
  limit: -1,
  limitRemaining: -1,
  downloaded: 100,
  uploaded: 10,
  daysRemaining: 8,
  daysPast: 22,
  endOfPeriod: getRollover(26).format('YYYY-MM-DD'),
  averageUsage: 5,
  averageLeft: -1,
  percentRemaining: -1,
})

const fakeLimited = () => ({
  lastUpdated: moment().format('YYYY-MM-DD'),
  updateTime: moment().format('h:mm a'),
  unlimited: false,
  corp: false,
  nolimit: false,
  limit: 1000,
  limitRemaining: 890,
  downloaded: 100,
  uploaded: 10,
  daysRemaining: 8,
  daysPast: 22,
  endOfPeriod: getRollover(26).format('YYYY-MM-DD'),
  averageUsage: 5,
  averageLeft: 110,
  percentRemaining: 89,
})

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

    const { username: login_username, password: login_password, } = this.state

    try {
      let usageURL = 'https://my.aussiebroadband.com.au/usage.php?xml=yes'
      let details = { login_username, login_password }
      let body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&')
      let method = 'POST'
      let headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
      let redirect = 'follow'

      let response = await fetch(usageURL, { method, headers, body, redirect, })
      let xml = await response.text()
      let json = await parseXML(xml)
      let usage = formatData(json)

      this.setState({ usage, isLoggedIn: true, isLoading: false, loginError: false })
    }
    catch (error) {
      console.log('login failed')
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
      await AsyncStorage.multiRemove(['username', 'password'])
      this.setState({ isLoggedIn: false, isAppReady: false, username: undefined, password: undefined })
    } catch (error) {
      console.log('failed to remove items from store')
    }
  }

  onLoginAnimationCompleted = () => this.setState({ isAppReady: true })
  setUsername = username => this.setState({ username })
  setPassword = password => this.setState({ password })

  async componentDidMount() {
    console.log('componentDidMount')
    try {
      let result = await AsyncStorage.multiGet(['username', 'password'])
      let map = result.map((v, i, a) => R.objOf(a[i][0], a[i][1]))
      let obj = Object.assign({}, ...map)
      if (obj.username != null && obj.password != null) {
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
