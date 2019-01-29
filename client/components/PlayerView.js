import React from 'react'
import firebase from '../firebase'
const database = firebase.database()

export default class PlayerView extends React.Component {
  constructor() {
    super()
    this.state = {
      gameStatus: 'waiting',
      gameName: null,
      currentQuestion: null,
      answerChoices: []
    }
    this.setState = this.setState.bind(this)
  }
  async componentDidMount() {
    // Get reference to current question: used to watch for changes
    const currentQuestionRef = database.ref(
      `/rooms/${this.props.slug}/active_game/current_question`
    )

    // Set inital game name
    const gameName = await database
      .ref(`/rooms/${this.props.slug}/active_game/game_name`)
      .once('value')
      .then(snapshot => snapshot.val())

    // Set initial game status
    const gameStatus = await database
      .ref(`/rooms/${this.props.slug}/status`)
      .once('value')
      .then(snapshot => snapshot.val())

    // Set inital current question
    const currentQuestion = await currentQuestionRef
      .once('value')
      .then(snapshot => snapshot.val())

    this.setState({
      gameName,
      gameStatus,
      currentQuestion
    })

    // Listens to changes of the currentQuestion
    currentQuestionRef.on('value', async snapshot => {
      if (snapshot.val()) {
        const answerChoices = await database
          .ref(`game_list/${this.state.gameName}/${snapshot.val()}/choices`)
          .once('value')
          .then(snapshot => snapshot.val())

        this.setState({currentQuestion: snapshot.val(), answerChoices})
      }
    })
  }

  render() {
    console.log(this.state)
    return (
      <div>
        {// Change this to this.state.gameStatus
        this.state.answerChoices ? (
          <h1>currentQuestion: {this.state.currentQuestion}</h1>
        ) : (
          <h1> player device waiting for game to start</h1>
        )}
      </div>
    )
  }
}
