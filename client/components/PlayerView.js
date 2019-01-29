import React from 'react'
import {connect} from 'react-redux'
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
      .then(snapshot => this.setState({currentQuestion: snapshot.val()}))

    // const gameName = await database
    //   .ref(`/rooms/${this.props.slug}/active_game/game_name`)
    //   .once('value')
    //   .then(snapshot => snapshot.val())

    currentQuestionRef.on('value', snapshot => {
      // console.log(snapshot.val())
      // const currentChoices = database.ref(`game_list/${gameName}`)
      if (snapshot.val()) {
        // this.setState({currentQuestion: snapshot.val()})
        // console.log(this.state)
        console.log(snapshot.val())
      }
    })
  }

  render() {
    return (
      <div>
        {this.state.currentQuestion ? (
          <h1>currentQuestion: {this.state.currentQuestion}</h1>
        ) : (
          <h1> player device waiting for game to start</h1>
        )}
      </div>
    )
  }
}
