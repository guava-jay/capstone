/* eslint-disable complexity */
import React from 'react'
import {connect} from 'react-redux'
import database from '../firebase'
import {startGameThunk} from '../store/game'
import {deletePlayerThunk} from '../store/user'
import QuizHostPlaying from './quiz/HostPlaying'
import QuizHostFinished from './quiz/HostFinished'
import MLTHostPlaying from './most_likely_to/HostPlaying'
import MLTHostFinished from './most_likely_to/HostFinished'

class HostView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      players: [],
      ready: false,
      status: null,
      selectedGame: ''
    }
    this.startGame = this.startGame.bind(this)
    this.deletePlayer = this.deletePlayer.bind(this)
  }

  startGame() {
    this.props.startGameThunk(this.props.slug)
  }

  deletePlayer(pid) {
    this.props.deletePlayerThunk(this.props.slug, pid)
  }

  async initializeState() {
    const playersRef = database.ref(`/rooms/${this.props.slug}/players`)
    const statusRef = database.ref(`/rooms/${this.props.slug}/status`)
    const selectGameRef = database.ref(
      `/rooms/${this.props.slug}/active_game/game_name`
    )

    await selectGameRef.once('value').then(snapshot => {
      this.setState({selectedGame: snapshot.val()})
    })

    await statusRef.on('value', snapshot => {
      if (snapshot.val()) this.setState({status: snapshot.val()})
    })

    await playersRef.on(
      'value',
      snapshot => {
        let gameName = null
        selectGameRef.on('value', s => {
          gameName = s.val()
        })
        let playerArr = []
        if (snapshot.val()) {
          let playerKeys = Object.keys(snapshot.val())
          playerKeys.forEach(key => {
            playerArr.push({[key]: snapshot.val()[key]})
          })
          this.setState({players: playerArr})
          if (gameName === 'quiz') {
            this.setState({ready: true})
          }
          if (gameName === 'most_likely_to' && playerArr.length > 1) {
            this.setState({ready: true})
          }
        } else {
          this.setState({players: [], ready: false})
        }
      },
      errorObject => {
        console.log('The read failed:', errorObject.code)
      }
    )
  }

  componentDidMount() {
    this.initializeState()
  }

  componentDidUpdate(prevProps) {
    if (this.props.slug !== prevProps.slug) {
      this.initializeState()
    }
  }

  render() {
    if (this.state.status === 'waiting') {
      return (
        <div id="host-view-container">
          <h1>CODE : {this.props.slug}</h1>
          <div id="list-player-host-container">
            <h2>Players</h2>
            {!this.state.players.length ? (
              <h3>Waiting for players to join...</h3>
            ) : (
              <ul>
                {this.state.players.map((player, i) => {
                  let pid = Object.keys(player)[0]
                  return (
                    <div key={i + ''}>
                      <li>
                        <p>
                          <i
                            onClick={e => {
                              this.deletePlayer(pid)
                            }}
                            className="fas fa-times icon-move"
                          />
                          {player[pid].displayName}
                        </p>
                      </li>
                    </div>
                  )
                })}
              </ul>
            )}
          </div>
          <button
            title="start game"
            className="button6"
            type="button"
            onClick={this.startGame}
            disabled={!this.state.ready}
          >
            Start Game
          </button>
          <img
            className="qr-code"
            src={`https://api.qrserver.com/v1/create-qr-code/?data=stackbox.herokuapp.com/join/${
              this.props.slug
            }`}
            alt=""
            title=""
          />
        </div>
      )
    } else if (this.state.status === 'playing') {
      // CHANGE GAME PLAYING COMPONENTS HERE
      if (this.state.selectedGame === 'quiz') {
        return <QuizHostPlaying players={this.state.players} />
      } else if (this.state.selectedGame === 'most_likely_to') {
        return <MLTHostPlaying players={this.state.players} />
      }
    } else if (this.state.status === 'finished') {
      // CHANGE GAME ENDING COMPONENT HERE
      if (this.state.selectedGame === 'quiz') {
        return <QuizHostFinished slug={this.props.slug} />
      } else if (this.state.selectedGame === 'most_likely_to') {
        return <MLTHostFinished />
      }
    } else {
      return null
    }
  }
}

const mapDispatch = dispatch => {
  return {
    startGameThunk: slug => dispatch(startGameThunk(slug)),
    deletePlayerThunk: (slug, uid) => dispatch(deletePlayerThunk(slug, uid))
  }
}

export default connect(null, mapDispatch)(HostView)
