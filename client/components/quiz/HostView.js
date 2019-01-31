import React from 'react'
import {connect} from 'react-redux'
import database from '../../firebase'
import {startGameThunk} from '../../store/game'
import HostPlaying from './HostPlaying'
import HostFinished from './HostFinished'

class HostView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      players: [],
      ready: false,
      status: null
    }
    this.startGame = this.startGame.bind(this)
  }

  startGame() {
    this.props.startGameThunk(this.props.slug)
  }

  componentDidMount() {
    //players
    const playersRef = database.ref(`/rooms/${this.props.slug}/players`)
    const statusRef = database.ref(`/rooms/${this.props.slug}/status`)

    statusRef.on('value', snapshot => {
      if (snapshot.val()) this.setState({status: snapshot.val()})
    })

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
    return (
      <div>
        {this.state.status === 'waiting' ? (
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
        ) : (
          ''
        )}

        {this.state.status === 'playing' ? (
          <HostPlaying players={this.state.players} />
        ) : (
          ''
        )}

        {this.state.status === 'finished' ? (
          <HostFinished slug={this.props.slug} />
        ) : (
          ''
        )}
      </div>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    startGameThunk: slug => dispatch(startGameThunk(slug))
  }
}

export default connect(null, mapDispatch)(HostView)
