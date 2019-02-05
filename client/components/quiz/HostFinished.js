import React from 'react'
import {connect} from 'react-redux'
import database from '../../firebase'
import {startGameThunk, resetGameThunk, deleteGameThunk} from '../../store/game'
import FinishedButtons from './FinishedButtons'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

class HostFinished extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      highScore: 0,
      winners: [],
      data: [],
      players: []
    }
    this.chartColors = ['#4ecdc4', '#ff6b6b', '#ffe66d', '#c4c4c4']
    this.resetGame = this.resetGame.bind(this)
    this.deleteGame = this.deleteGame.bind(this)
  }

  findHighScore(obj) {
    let highScore = 0
    let winners = []

    for (let player in obj) {
      if (obj.hasOwnProperty(player)) {
        const currentScore = obj[player].currentScore
        const playerName = obj[player].displayName

        if (currentScore > highScore) {
          highScore = currentScore
          winners = [playerName]
          // Adds an extra winner in case of tie
        } else if (currentScore === highScore && highScore !== 0) {
          winners.push(playerName)
        }
      }
    }

    this.setState({highScore, winners})
  }

  async componentDidMount() {
    const answersObj = await database
      .ref(`/rooms/${this.props.slug}/players`)
      .once('value')
      .then(snapshot => snapshot.val())

    this.findHighScore(answersObj)
    this.getAnswerData()
  }

  async getAnswerData() {
    const playerAnswers = await database
      .ref(`rooms/${this.props.slug}/players`)
      .once('value')
      .then(snapshot => snapshot.val())

    const players = Object.keys(playerAnswers)
    const dataObj = {}
    const playerNamesArr = []

    players.forEach(player => {
      const playerObj = playerAnswers[player]
      const questions = Object.keys(playerObj.answers)
      const displayName = playerObj.displayName

      playerNamesArr.push(displayName)

      questions.forEach(question => {
        let score

        if (playerObj.answers[question].correct) score = 1
        else score = 0

        if (!dataObj[question]) dataObj[question] = {[displayName]: score}
        else dataObj[question][displayName] = score
      })
    })

    // turn into array
    const dataArr = Object.keys(dataObj).map((question, i) => ({
      name: i + 1,
      ...dataObj[question]
    }))

    this.setState({data: dataArr, players: playerNamesArr})
  }

  async resetGame() {
    await this.props.resetGameThunk(this.props.game.slug)
    await this.props.startGameThunk(this.props.game.slug)
  }

  async deleteGame() {
    await this.props.deleteGameThunk(this.props.game.slug)
  }

  render() {
    const hasNoWinners = this.state.winners.length === 0
    const hasOneWinner = this.state.winners.length === 1
    const hasTie = this.state.winners.length > 1
    const highScore = this.state.highScore

    let endView

    if (hasOneWinner) {
      endView = (
        <p className="center winner-display">
          {this.state.winners[0]} wins with {highScore} point
          {highScore === 1 ? '' : 's'}!
        </p>
      )
    } else if (hasTie) {
      endView = (
        <p className="center winner-display">
          There was a tie! Congratulations {this.state.winners.join(' and ')}!
          You all tied with a score of {highScore}!
        </p>
      )
    } else if (hasNoWinners) {
      endView = <p className="center winner-display">No one won :-(</p>
    }

    return (
      <div id="host-finished">
        <audio
          id="applause"
          autoPlay
          src="https://s3.amazonaws.com/stackbox/applause.mp3"
        />
        <h1 className="center">Finished!</h1>
        {endView}
        <div id="recharts-container">
          <BarChart
            width={600}
            height={300}
            data={this.state.data}
            margin={{top: 20, right: 30, left: 20, bottom: 5}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{value: 'Question', position: 'bottom', dx: -150}}
            />
            <YAxis
              domain={[0, this.state.players.length]}
              allowDecimals={false}
              label={{
                value: 'Num of players answering correctly',
                angle: -90,
                position: 'insideBottomLeft'
              }}
            />
            <Tooltip />
            <Legend />
            {this.state.players.map((player, i) => (
              <Bar
                key={player}
                dataKey={player}
                stackId="a"
                fill={this.chartColors[i]}
              />
            ))}
          </BarChart>
        </div>
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
