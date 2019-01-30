import React from 'react'
import firebase from '../firebase'
const database = firebase.database()

export default class PlayerView extends React.Component {
  constructor() {
    super()
    this.state = {
      gameStatus: '',
      gameName: null,
      currentQuestion: null,
      answerChoices: [],
      responses: {}
    }
    this.setState = this.setState.bind(this)
    this.setChoice = this.setChoice.bind(this)
  }

  // Can select between an answer multiple times...
  setChoice(event) {
    event.preventDefault()
    console.log(event.target.name)
    const currentQuestion = this.state.currentQuestion
    const currentResponse = event.target.name
    const responses = {
      ...this.state.responses,
      [currentQuestion]: currentResponse
    }

    // ...But can only submit once per question
    // submitChoice(){

    // }

    this.setState({responses})
    // {responses[this.state.currentQuestion]: event.target.name}
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
      if (snapshot.val() >= 0) {
        const answerChoices = await database
          .ref(`game_list/${this.state.gameName}/${snapshot.val()}/choices`)
          .once('value')
          .then(snapshot => snapshot.val())
        console.log(answerChoices)
        this.setState({currentQuestion: snapshot.val(), answerChoices})
      }
    })

    // Listens to changes of the gameStatus
    database.ref(`/rooms/${this.props.slug}/status`).on('value', snapshot => {
      this.setState({gameStatus: snapshot.val()})
    })
  }

  render() {
    console.log(this.state)
    return (
      <div>
        {this.state.gameStatus === 'waiting' ? (
          <h1>Waiting to start...</h1>
        ) : (
          ''
        )}

        {this.state.gameStatus === 'playing' ? (
          <div>
            <h1>Choose carefully...</h1>
            {// Show answer choices
            this.state.answerChoices ? (
              <div>
                {this.state.answerChoices.map((choice, idx) => (
                  <button
                    name={idx}
                    type="submit"
                    onClick={this.setChoice}
                    key={idx}
                  >
                    {choice}
                  </button>
                ))}
                <br />
                <button>Submit choice</button>
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}

        {this.state.gameStatus === 'finished' ? <h1>Done!</h1> : ''}
      </div>
    )
  }
}
