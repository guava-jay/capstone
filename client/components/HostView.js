import React from 'react'
import {connect} from 'react-redux'
import firebase from '../firebase'
const database = firebase.database()

export default class HostView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      players: [],
      ready: false,
      playing: false
    }
    this.startGame = this.startGame.bind(this)
  }

  startGame() {
    this.setState({playing: true})
  }

  componentDidMount() {
    //players
    let playersRef = database.ref(`/rooms/${this.props.slug}/players`)
    playersRef.on(
      'value',
      snapshot => {
        let playerArr = []
        if (snapshot.val()) {
          let playerKeys = Object.keys(snapshot.val())
          playerKeys.forEach(key => {
            playerArr.push({[key]: snapshot.val()[key]})
          })
          this.setState({players: playerArr, ready: true})
        } else {
          this.setState({players: [], ready: false})
        }
      },
      errorObject => {
        console.log('The read failed:', errorObject.code)
      }
    )
  }

  render() {
    return this.state.playing ? (
      <div>
        <h1>Time to play!</h1>
      </div>
    ) : (
      <div>
        <h1>code: {this.props.slug}</h1>
        <ul>
          {this.state.players.map((player, i) => {
            let pid = Object.keys(player)[0]
            return <li key={i + ''}> {player[pid].displayName}</li>
          })}
        </ul>
        <button
          type="button"
          onClick={this.startGame}
          disabled={!this.state.ready}
        >
          Start Game
        </button>
      </div>
    )
  }
}
