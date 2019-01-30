import React from 'react'
import firebase from '../firebase'
const database = firebase.database()
import {connect} from 'react-redux'
import Highlight from 'react-highlight'
import {checkAnswersThunk} from '../store/game'

class HostPlaying extends React.Component {
  constructor() {
    super()
    this.state = {
      currentQuestion: null,
      question: {},
      answers: {},
      count: 0
    }
  }
  componentDidMount() {
    //listening for current question and upating
    const currentQuestionRef = database.ref(
      `rooms/${this.props.game.slug}/active_game/current_question`
    )

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
          currentQuestion: snapshot.val(),
          question: {prompt, func}
        })
      }
    })

    //listening for answers first and checking them later
    //we still need to add timer here
    const answerRef = database.ref(
      `rooms/${this.props.game.slug}/active_game/current_answers`
    )

    answerRef.on('value', snapshot => {
      if (snapshot.val()) {
        console.log('yes')
        this.setState(prevState => {
          return {
            count: prevState.count + 1
          }
        })
        console.log(this.state.count, 'count from host playing')
      }
      if (this.state.count === this.props.players.length) {
        this.props.checkAnswersThunk(
          snapshot.val(),
          this.state.currentQuestion,
          this.props.game.slug
        )
        //checking answers and updating scores here
        //need to reset the current answers in state and wait for next question
      }
    })
  }
  render() {
    return (
      <div>
        <div>
          <h2>Players</h2>
          <ul>
            {this.props.players.map(x => {
              let key = Object.keys(x)
              return <li key={key}>{x[key].displayName}</li>
            })}
          </ul>
        </div>
        {this.state.question.prompt ? (
          <h1>{this.state.question.prompt}</h1>
        ) : null}
        {this.state.question.func ? (
          <Highlight language="javascript">
            {this.state.question.func}
          </Highlight>
        ) : null}
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
    checkAnswersThunk: (answers, currentQuestion, slug) =>
      dispatch(checkAnswersThunk(answers, currentQuestion, slug))
  }
}

export default connect(mapState, mapDispatch)(HostPlaying)
