import React from 'react'
import {connect} from 'react-redux'
import Highlight from 'react-highlight'
import database from '../../firebase'
import {checkAnswersThunk, getNewQuestion} from '../../store/game'

class HostPlaying extends React.Component {
  constructor() {
    super()
    this.state = {
      currentQuestion: null,
      question: {},
      count: 0,
      currentQuestionAnswer: null
    }
    this.updateQuestion = this.updateQuestion.bind(this)
  }
  async componentDidMount() {
    this.props.getNewQuestion(this.props.game.slug)
    //listening for current question and upating
    const currentQuestionRef = database.ref(
      `rooms/${this.props.game.slug}/active_game/current_question`
    )

    await currentQuestionRef.on('value', async snapshot => {
      if (snapshot.val() >= 0) {
        let question
        let func
        await database
          .ref(`game_list/quiz/${snapshot.val()}`)
          .once('value')
          .then(snapshot => {
            if (snapshot.val().question !== null) {
              question = snapshot.val().question || null
            }
            if (snapshot.val().function !== null) {
              func = snapshot.val().function || null
            }
          })
        this.setState({
          currentQuestion: snapshot.val(),
          question: {question, func}
        })
      }
    })

    //listening for answers first and checking them later
    //we still need to add timer here
    const answerRef = database.ref(
      `rooms/${this.props.game.slug}/active_game/current_answers`
    )

    answerRef.on('value', async snapshot => {
      if (snapshot.val()) {
        this.setState(prevState => {
          return {
            count: prevState.count + 1
          }
        })
      }
      if (this.state.count === this.props.players.length) {
        let getAnswer = await this.props.checkAnswersThunk(
          snapshot.val(),
          this.state.currentQuestion,
          this.props.game.slug
        )
        this.setState({currentQuestionAnswer: getAnswer})
        setTimeout(this.updateQuestion, 2000)
        //set timer to call next question
      }
    })
  }

  async updateQuestion() {
    let idk = await this.props.getNewQuestion(this.props.game.slug)
    this.setState({count: 0, answers: {}, currentQuestionAnswer: null})
  }
  render() {
    return (
      <div>
        <audio
          autoPlay
          loop
          src="https://s3.amazonaws.com/stackbox/Marimba-music.mp3"
        >
          Your browser does not support the audio element.
        </audio>
        <div>
          <h2>Players</h2>
          <ul>
            {this.props.players.map(x => {
              let key = Object.keys(x)
              return (
                <li key={key}>
                  {x[key].displayName} : {x[key].currentScore}
                </li>
              )
            })}
          </ul>
        </div>
        {this.state.question.question ? (
          <h1>{this.state.question.question}</h1>
        ) : null}
        {this.state.question.func ? (
          <Highlight language="javascript">
            {this.state.question.func}
          </Highlight>
        ) : null}

        {/* show answer */}
        {this.state.currentQuestionAnswer !== null ? (
          <h3>Answer : {this.state.currentQuestionAnswer}</h3>
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
      dispatch(checkAnswersThunk(answers, currentQuestion, slug)),
    getNewQuestion: slug => dispatch(getNewQuestion(slug))
  }
}

export default connect(mapState, mapDispatch)(HostPlaying)