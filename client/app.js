import React from 'react'
import Routes from './routes'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {setPlayerThunk} from './store/user'
import {Header} from './components'

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Routes />
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user
})

const mapDispatch = dispatch => {
  return {setPlayerThunk: (room, name) => dispatch(setPlayerThunk(room, name))}
}

export default withRouter(connect(mapState, mapDispatch)(App))
