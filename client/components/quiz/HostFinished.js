import React from 'react'
import database from '../../firebase'
import Navbar from '../navbar'

export default class HostFinished extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      highScore: 0,
      winners: []
    }
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
  }

  render() {
    const hasNoWinners = this.state.winners.length === 0
    const hasOneWinner = this.state.winners.length === 1
    const hasTie = this.state.winners.length > 1

    const highScore = this.state.highScore

    let endView

    if (hasOneWinner) {
      endView = (
        <h3>
          {this.state.winners[0]} wins with {highScore} points!
        </h3>
      )
    } else if (hasTie) {
      endView = (
        <h3>
          There was a tie! Congratulations {this.state.winners.join(' and ')}!
          You all tied with a score of {highScore}!
        </h3>
      )
    } else if (hasNoWinners) {
      endView = <h3>No one won :-(</h3>
    }

    return (
      <div>
        <h1>Finished!</h1>
        {endView}
        <Navbar />
      </div>
    )
  }
}
