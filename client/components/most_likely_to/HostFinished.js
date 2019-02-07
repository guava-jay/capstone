import React from 'react'
import {connect} from 'react-redux'
import database from '../../firebase'
import {startGameThunk, resetGameThunk, deleteGameThunk} from '../../store/game'
import FinishedButtons from '../FinishedButtons'

class HostFinished extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      wonRounds: {},
      players: []
    }
    this.resetGame = this.resetGame.bind(this)
    this.deleteGame = this.deleteGame.bind(this)
  }

  // Find player who was voted the most likely to
  // findHighScore() {}

  initializeState() {
    const stateObj = {}

    database
      .ref(`/rooms/${this.props.game.slug}/players`)
      .once('value')
      .then(snapshot => {
        const playerAnswers = snapshot.val()
        const playersIds = Object.keys(playerAnswers)
        const playerNames = []

        playersIds.forEach(uid => {
          const displayName = playerAnswers[uid].displayName
          const wonRounds = Object.keys(playerAnswers[uid].won)

          playerNames.push(displayName)
          stateObj[displayName] = wonRounds
        })

        this.setState({wonRounds: stateObj, players: playerNames})
      })
  }

  componentDidMount() {
    this.initializeState()
  }

  async resetGame() {
    await this.props.resetGameThunk(this.props.game.slug)
    await this.props.startGameThunk(this.props.game.slug)
  }

  async deleteGame() {
    await this.props.deleteGameThunk(this.props.game.slug)
  }

  render() {
    return (
      <div id="host-finished">
        <audio
          id="applause"
          autoPlay
          src="https://s3.amazonaws.com/stackbox/applause.mp3"
        />
        <h1 className="center">Finished!</h1>
        <h2>Here's what each person was voted most likely to:</h2>
        {this.state.players.map(player => (
          <div key={player}>
            <p>{player}</p>
            {this.state.wonRounds[player] ? (
              this.state.wonRounds[player].map(won => <li key={won}>{won}</li>)
            ) : (
              <p>Sorry, you didn't win any rounds!</p>
            )}
          </div>
        ))}

        <FinishedButtons
          secondButton="create"
          resetGame={this.resetGame}
          deleteRoom={this.deleteGame}
        />
      </div>
    )
  }
}

const mapState = state => {
  return {
    game: state.game
  }
}
const mapDispatch = dispatch => {
  return {
    startGameThunk: slug => dispatch(startGameThunk(slug)),
    resetGameThunk: slug => dispatch(resetGameThunk(slug)),
    deleteGameThunk: slug => dispatch(deleteGameThunk(slug))
  }
}

export default connect(mapState, mapDispatch)(HostFinished)
