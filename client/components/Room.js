import React from 'react'
import {connect} from 'react-redux'
import firebase from '../firebase'
const database = firebase.database()

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
    console.log('this in component:', this, this.state)
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
          console.log(playerArr)
          this.setState({players: playerArr})
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
        <div>
          <h1>code: {this.props.game.slug}</h1>
          <ul>
            {this.state.players.map((player, i) => {
              console.log(player)
              let pid = Object.keys(player)[0]
              return <li key={i + ''}> {player[pid].displayName}</li>
            })}
          </ul>
        </div>
      )
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
