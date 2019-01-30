import React from 'react'
import firebase from '../firebase'
const database = firebase.database()
import {connect} from 'react-redux'

class HostPlaying extends React.Component {
  constructor() {
    super()
    this.state = {
      question: {}
    }
  }
  async componentDidMount() {
    const currentQuestionRef = database.ref(
      `rooms/${this.props.game.slug}/active_game/current_question`
    )

    // const gameName = await database
    //     .ref(`/rooms/${this.props.game.slug}/active_game/game_name`)
    //     .once('value')
    //     .then(snapshot => snapshot.val())

    // const currentQuestion = await currentQuestionRef
    //     .once('value')
    //     .then(snapshot => snapshot.val())

    currentQuestionRef.on('value', async snapshot => {
      if (snapshot.val() >= 0) {
        let prompt
        let func
        await database
          .ref(`game_list/quiz/${snapshot.val()}`)
          .once('value')
          .then(snapshot => {
            prompt = snapshot.val().prompt
            func = snapshot.val().function || null
          })
        this.setState({
          question: {prompt, func}
        })
      }
    })
  }
  render() {
    return (
      <div>
        {this.state.question.prompt ? (
          <h1>{this.state.question.prompt}</h1>
        ) : null}
        {this.state.question.func ? <h1>{this.state.question.func}</h1> : null}
      </div>
    )
  }
}

const mapState = state => {
  return {
    game: state.game
  }
}

export default connect(mapState)(HostPlaying)
