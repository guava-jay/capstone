import React from 'react'
import {connect} from 'react-redux'
import database from '../../firebase'
import {startGameThunk} from '../../store/game'
import {deletePlayerThunk} from '../../store/user'
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
    this.deletePlayer = this.deletePlayer.bind(this)
  }

  startGame() {
    this.props.startGameThunk(this.props.slug)
  }

  deletePlayer(context) {
    //also remove from state
    console.log('clicked! uid =', context.id)
    this.props.deletePlayerThunk(this.props.slug, context.id)
  }

  async componentDidMount() {
    //players
    const playersRef = database.ref(`/rooms/${this.props.slug}/players`)
    const statusRef = database.ref(`/rooms/${this.props.slug}/status`)

    await statusRef.on('value', snapshot => {
      if (snapshot.val()) this.setState({status: snapshot.val()})
    })

    await playersRef.on(
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
    if (this.state.status === 'waiting') {
      return (
        <div>
          <h1>code: {this.props.slug}</h1>
          <ul>
            {this.state.players.map((player, i) => {
              let pid = Object.keys(player)[0]
              return (
                <div key={i + ''}>
                  <li>
                    <button
                      id={i + ''}
                      type="button"
                      onClick={this.deletePlayer(this)}
                    >
                      x
                    </button>
                    {player[pid].displayName}
                  </li>
                </div>
              )
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
    } else if (this.state.status === 'playing') {
      return <HostPlaying players={this.state.players} />
    } else if (this.state.status === 'finished') {
      return <HostFinished slug={this.props.slug} />
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
