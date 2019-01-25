import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {Welcome, Join, CreateGame} from './components'

class Routes extends Component {
  componentDidMount() {
    console.log('mounted from routes js placeholder')
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/home" component={Welcome} />
        <Route exact path="/join" component={Join} />
        <Route exact path="/newGame" component={CreateGame} />
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
