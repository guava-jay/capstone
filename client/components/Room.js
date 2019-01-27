import React from 'react'
import {connect} from 'react-redux'
import firebase from 'firebase'
const database = firebase.database()

class Room extends React.Component {
  componentDidMount() {
    database
      .ref('/rooms')
      .once('value')
      .then(snapshot => {
        if (!snapshot.hasChild(this.props.match.params.slug)) {
          this.props.history.push('/')
        }
      })
  }

  render() {
    //checking for user disconnect
    if (this.props.user.role === 'host') {
      database
        .ref(`rooms/${this.props.game.slug}`)
        .onDisconnect()
        .remove()
    }
    return <h1>hi room</h1>
  }
}

const mapState = state => {
  return {
    game: state.game,
    user: state.user
  }
}

export default connect(mapState)(Room)
