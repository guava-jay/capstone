import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import {Welcome, Join, CreateGame, Room, HowToPlay, About} from './components'
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
  componentDidMount() {
    if (!this.props.user.uid) {
      this.props.setPlayerThunk()
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route path="/home" component={Welcome} />
        <Route path="/join" component={Join} />
        <Route path="/how-to-play" component={HowToPlay} />
        <Route path="/about" component={About} />
        <Route exact path="/newGame" component={CreateGame} />
        <Route path="/newGame/:slug" component={Room} />
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
    setPlayerThunk: () => dispatch(setPlayerThunk())
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
