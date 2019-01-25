import React from 'react'
import firebase from './firebase'
import {Navbar} from './components'
import Routes from './routes'
import {connect} from 'react-redux'

// Front-end firebase is firebase.database()
const database = firebase.database()

class App extends React.Component {
  render() {
    console.log(this)
    // Move this to back-end?
    database
      .ref(`rooms/ABDEF/players/${this.props.user.uid}`)
      .onDisconnect()
      .remove() // can also use (set(null))

    return (
      <div>
        <Routes />
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user
})

export default connect(mapState)(App)
