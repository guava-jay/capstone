import React from 'react'
import firebase from '../firebase'
const database = firebase.database()

export default class PlayerView extends React.Component {
  constructor() {
    super()
    this.state = {
      gameStatus: 'waiting',
      currentQuestion: null,
      gameName: null,
      answerChoices: []
    }
    this.setState = this.setState.bind(this)
  }
  async componentDidMount() {
    const currentQuestionRef = database.ref(
      `/rooms/${this.props.slug}/active_game/current_question`
    )

    const currentQuestion = await currentQuestionRef
      .once('value')
      .then(snapshot => {
        this.setState({currentQuestion: snapshot.val()})
      })

    const gameName = await database
      .ref(`/rooms/${this.props.slug}/active_game/game_name`)
      .once('value')
      .then(snapshot => this.setState({gameName: snapshot.val()}))

    const gameStatusRef = await database
      .ref(`/rooms/${this.props.slug}/status`)
      .once('value')
      .then(snapshot => this.setState({gameStatus: snapshot.val()}))

    currentQuestionRef.on('value', snapshot => {
      if (snapshot.val()) {
        const questions = database
          .ref(`game_list/${this.state.gameName}/${this.state.currentQuestion}`)
          .once('value')
          .then(snapshot => console.log(snapshot.val()))
        this.setState({currentQuestion: snapshot.val()})
      }
    })
  }

  render() {
    console.log(this.state)
    return (
      <div>
        {// Change this to this.state.gameStatus
        this.state.currentQuestion >= 0 ? (
          <h1>currentQuestion: {this.state.currentQuestion}</h1>
        ) : (
          <h1> player device waiting for game to start</h1>
        )}
      </div>
    )
  }
}
