import React from 'react'
import {connect} from 'react-redux'
import firebase from '../firebase'
const database = firebase.database()
import HostView from './HostView'
import PlayerView from './PlayerView'

class Room extends React.Component {
  constructor() {
    super()
    this.state = {
      players: []
    }
    this.setState = this.setState.bind(this)
    //database.ref(`/rooms/${this.props.game.slug}/players`).on()
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
    //players
    let playersRef = database.ref(
      `/rooms/${this.props.match.params.slug}/players`
    )
    playersRef.on(
      'value',
      snapshot => {
        let playerArr = []
        if (snapshot.val()) {
          let playerKeys = Object.keys(snapshot.val())
          playerKeys.forEach(key => {
            playerArr.push({[key]: snapshot.val()[key]})
          })
          this.setState({players: playerArr})
        } else {
          this.setState({players: []})
        }
      },
      errorObject => {
        console.log('The read failed:', errorObject.code)
      }
    )
  }

  render() {
    //checking for user disconnect

    if (this.props.user.role === 'host') {
      database
        .ref(`rooms/${this.props.game.slug}`)
        .onDisconnect()
        .remove()
      return (
        <HostView slug={this.props.game.slug} players={this.state.players} />
      )
      //host device
    }

    // player device
    if (this.props.user.role === 'player') {
      database
        .ref(`rooms/${this.props.game.slug}/players/${this.props.user.uid}`)
        .onDisconnect()
        .remove()

      return <PlayerView />
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
