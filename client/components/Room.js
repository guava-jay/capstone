import React from 'react'
import {connect} from 'react-redux'
import firebase from '../firebase'
const database = firebase.database()

class Room extends React.Component {
  constructor() {
    super()
    database.ref(`/rooms/${this.props.game.slug}/players`).on()
  }

  componentDidMount() {
    //checks to see if room exists
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
      return <h1>code: {this.props.game.slug}</h1>
      //host device
    }
    // player device
    if (this.props.user.role === 'player') {
      database
        .ref(`rooms/${this.props.game.slug}/players/${this.props.user.uid}`)
        .onDisconnect()
        .remove()
      return <h1>player device waiting for game to start</h1>
    }

    return <h1>loading</h1>
  }
}

const mapState = state => {
  return {
    game: state.game,
    user: state.user
  }
}

export default connect(mapState)(Room)
