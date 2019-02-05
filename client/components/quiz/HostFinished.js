import React from 'react'
import {connect} from 'react-redux'
import database from '../../firebase'
import {startGameThunk, resetGameThunk} from '../../store/game'
import FinishedButtons from './FinishedButtons'

class HostFinished extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      highScore: 0,
      winners: []
    }
    this.resetGame = this.resetGame.bind(this)
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
    // const data = [{name: '1', eve: 4000, guest: 2400}]

    const dataObj = {}

    players.forEach(player => {
      const playerObj = playerAnswers[player]
      const questions = Object.keys(playerObj.answers)
      const displayName = playerObj.displayName

      console.log('playerObj', playerObj)
      console.log('questions', questions)
      console.log('displayName', displayName)

      questions.forEach(question => {
        let score

        console.log(playerObj.answers[question].correct)

        if (playerObj.answers[question].correct) score = 1
        else score = 0

        if (!dataObj[question]) dataObj[question] = {[displayName]: score}
        else dataObj[question][displayName] = score
      })
    })

    console.log(dataObj)
    return dataObj
  }

  // async getAnswerData() {
  //   const playerAnswers = await database
  //     .ref(`rooms/${this.props.slug}/players`)
  //     .once('value')
  //     .then(snapshot => snapshot.val())

  //   const players = Object.keys(playerAnswers)
  //   let dataObj = {}

  //   players.forEach(uid => {
  //     const indivAnswers = Object.keys(playerAnswers[uid].answers)
  //     const displayName = playerAnswers[uid].displayName

  //     indivAnswers.forEach(questionId => {
  //       // check if answer was correct
  //       database
  //         .ref(`game_list/quiz/${questionId}/answer`)
  //         .once('value')
  //         .then(snapshot => {
  //           let points
  //           if (snapshot.val() === playerAnswers[uid].answers[questionId]) {
  //             points = 1
  //           } else {
  //             points = 0
  //           }

  //           if (!dataObj[questionId]) dataObj[questionId] = {}

  //           dataObj[questionId][displayName] = points
  //         })
  //     })
  //   })

  //   return dataObj
  //   // const data = [{name: '1', eve: 4000, guest: 2400}]
  // }

  // formatData(obj) {
  //   const dataArr = Object.keys(obj).map(key => ({
  //     name: key,
  //     ...obj[key]
  //   }))

  //   return dataArr
  // }

  async resetGame() {
    await this.props.resetGameThunk(this.props.game.slug)
    await this.props.startGameThunk(this.props.game.slug)
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
        <FinishedButtons secondButton="create" resetGame={this.resetGame} />
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
    resetGameThunk: slug => dispatch(resetGameThunk(slug))
  }
}

export default connect(mapState, mapDispatch)(HostFinished)
