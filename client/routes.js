import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import {Welcome, Join, CreateGame, Anon, Room} from './components'
import {setPlayerThunk} from './store/user'
import firebase from 'firebase'

firebase
  .auth()
  .signInAnonymously()
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code
    var errorMessage = error.message
    // ...
  })

class Routes extends Component {
  async componentDidMount() {
    const {user} = await firebase
      .auth()
      .signInAnonymously()
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // ...
      })
    this.props.setPlayerThunk(user.uid)
  }

  render() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user.uid, 'use from routes')
      } else {
        console.log('no users')
      }
    })
    return (
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route path="/home" component={Welcome} />
        <Route path="/join" component={Join} />
        <Route exact path="/newGame" component={CreateGame} />
        <Route path="/newGame/:slug" component={Room} />
        <Route path="/anon" component={Anon} />
        <Redirect to="/" />
      </Switch>
    )
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    setPlayerThunk: uid => dispatch(setPlayerThunk(uid))
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
