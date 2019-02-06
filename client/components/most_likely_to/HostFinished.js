import React from 'react'
import {connect} from 'react-redux'
import database from '../../firebase'
import {startGameThunk, resetGameThunk, deleteGameThunk} from '../../store/game'
import FinishedButtons from '../FinishedButtons'

class HostFinished extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      highScore: 0,
      winners: [],
      players: []
    }
    this.resetGame = this.resetGame.bind(this)
    this.deleteGame = this.deleteGame.bind(this)
  }

  // Find player who was voted the most likely to
  // findHighScore() {}

  initializeState() {
    database
      .ref(`/rooms/${this.props.game.slug}`)
      .once('value')
      .then(snapshot => {
        const dataObj = snapshot.val()
        const players = Object.keys(dataObj.players)
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
