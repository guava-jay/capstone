import React from 'react'
import {connect} from 'react-redux'
import database from '../firebase'
import HostView from './quiz/HostView'
import PlayerView from './quiz/PlayerView'

class Room extends React.Component {
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
      return <HostView slug={this.props.game.slug} />
      //host device
    }

    // player device
    if (this.props.user.role === 'player') {
      database
        .ref(`rooms/${this.props.game.slug}/players/${this.props.user.uid}`)
        .onDisconnect()
        .remove()

      return <PlayerView slug={this.props.game.slug} />
    }

    return <h1 id="loading">loading</h1>
  }
}

const mapState = state => {
  return {
    game: state.game,
    user: state.user
  }
}

export default connect(mapState)(Room)
