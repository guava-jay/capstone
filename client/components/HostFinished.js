import React from 'react'
import firebase from '../firebase'
const database = firebase.database()

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
        } else if (currentScore === highScore) {
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

    console.log(answersObj)
    console.log(this.findHighScore(answersObj))
  }

  render() {
    return (
      <div>
        <h1>Finished!</h1>

        {this.state.winners.length > 1 ? (
          <h3>
            There was a tie! Congratulations {this.state.winners.join(' and ')}!
          </h3>
        ) : (
          <h3>
            {this.state.winners[0]} wins with {this.state.highScore} points!
          </h3>
        )}
      </div>
    )
  }
}
