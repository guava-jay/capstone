import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import {Welcome, Join, CreateGame, Anon, Room} from './components'

class Routes extends Component {
  render() {
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

const mapDispatch = dispatch => {
  return {}
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(null, mapDispatch)(Routes))
