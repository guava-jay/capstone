import React from 'react'
import {connect} from 'react-redux'
import database from '../firebase'
import HostView from './quiz/HostView'
import PlayerView from './quiz/PlayerView'
import Welcome from './Welcome'
import {resetThunk} from '../store/game'

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

  componentWillUnmount() {
    console.log('i unmounted this shit')
    this.props.resetThunk()
  }

  render() {
    // const playerRef = await database.ref(
    //   `${ROOM}/players/${this.props.user.uid}`
    // )

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
    return <Welcome />
  }
}

const mapState = state => {
  return {
    game: state.game,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    resetThunk: () => dispatch(resetThunk())
  }
}

export default connect(mapState, mapDispatch)(Room)
