/* eslint-disable complexity */
import React from 'react'
import {connect} from 'react-redux'
import database from '../../firebase'
import {startGameThunk} from '../../store/game'
import {deletePlayerThunk} from '../../store/user'

// Host views for each game
import QuizHostPlaying from '../quiz/HostPlaying'
import QuizHostFinished from '../quiz/HostFinished'
import MLTHostPlaying from '../most_likely_to/HostPlaying'
import MLTHostFinished from '../most_likely_to/HostFinished'
import HostWaiting from './HostWaiting'

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
        <HostWaiting
          slug={this.props.slug}
          players={this.state.players}
          startGame={this.startGame}
          ready={this.state.ready}
        />
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
