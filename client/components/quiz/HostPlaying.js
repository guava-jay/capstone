/* eslint-disable complexity */
import React from 'react'
import {connect} from 'react-redux'
import Highlight from 'react-highlight'
import database from '../../firebase'
import {checkAnswersThunk, getNewQuestion, endGameThunk} from '../../store/game'

class HostPlaying extends React.Component {
  constructor() {
    super()
    this.state = {
      questionCount: 0,
      currentQuestion: null,
      question: {},
      choices: [],
      count: 0,
      currentQuestionAnswer: null,
      muted: false
    }
    this.updateQuestion = this.updateQuestion.bind(this)
    this.endGame = this.endGame.bind(this)
  }
  async componentDidMount() {
    await this.props.getNewQuestion(
      this.props.game.slug,
      this.props.game.gameName
    )
    //listening for current question and upating
    const currentQuestionRef = database.ref(
      `rooms/${this.props.game.slug}/active_game/current_question`
    )

    await currentQuestionRef.on('value', async snapshot => {
      if (snapshot.val() >= 0) {
        let question
        let func
        let choices
        await database
          .ref(`game_list/quiz/${snapshot.val()}`)
          .once('value')
          .then(snapshots => {
            if (snapshots.val()) {
              question = snapshots.val().question || null
              func = snapshots.val().function || null
              choices = snapshots.val().choices || null
            }
          })
        this.setState(prevState => {
          return {
            questionCount: prevState.questionCount + 1,
            currentQuestion: snapshot.val(),
            question: {question, func},
            choices: choices
          }
        })
      }
    })

    //listening for answers first and checking them later
    //we still need to add timer here
    const answerRef = database.ref(
      `rooms/${this.props.game.slug}/active_game/current_answers`
    )

    await answerRef.on('value', async snapshot => {
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
        document.getElementById('ding').play()
        this.setState({currentQuestionAnswer: getAnswer})
        setTimeout(this.updateQuestion, 3000)
        //set timer to call next question
      }
    })
  }

  componentWillUnmount() {
    const currentQuestionRef = database.ref(
      `rooms/${this.props.game.slug}/active_game/current_question`
    )
    const answerRef = database.ref(
      `rooms/${this.props.game.slug}/active_game/current_answers`
    )

    answerRef.off()
    currentQuestionRef.off()
  }

  updateQuestion() {
    //stops the game at 10 questions
    if (this.state.questionCount === 10) {
      this.props.endGameThunk(this.props.game.slug)
      this.setState({count: 0, currentQuestionAnswer: null})
    } else {
      this.props.getNewQuestion(this.props.game.slug, this.props.game.gameName)
      this.setState({count: 0, currentQuestionAnswer: null})
    }
  }

  async endGame() {
    await this.props.endGameThunk(this.props.game.slug)
  }

  render() {
    return (
      <div id="host-playing-container">
        <audio
          id="audio"
          muted={this.state.muted}
          autoPlay
          loop
          src="https://s3.amazonaws.com/stackbox/Marimba-music.mp3"
        />
        <audio id="ding" src="https://s3.amazonaws.com/stackbox/ding.mp3" />
        <div id="host-playing-players-container">
          <h2>Players</h2>
          <div id="list-players-host-playing">
            {!this.props.players.length ? (
              <div>All players have left the game</div>
            ) : (
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
            )}
          </div>
        </div>
        {this.state.questionCount === 9 && <h2>One more question!</h2>}
        {this.state.questionCount === 10 && <h2>Last one!</h2>}
        {this.state.question.question ? (
          <h1 className="host-q-display">{this.state.question.question}</h1>
        ) : null}
        <div id="question-host-container">
          {this.state.question.func ? (
            <Highlight language="javascript">
              {this.state.question.func}
            </Highlight>
          ) : null}
          {/* show answer or display question */}
          {this.state.currentQuestionAnswer !== null ? (
            <p id="show-answer-host">
              Answer : {this.state.currentQuestionAnswer}
            </p>
          ) : (
            this.state.choices.length && (
              <div id="list-choice-host">
                <ul>
                  {this.state.choices.map(x => (
                    <React.Fragment key={x}>
                      <li>{x}</li>
                      <hr />
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            )
          )}
          <div id="host-play-buttons">
            <button
              title="end game"
              className="button6 buttonEnd"
              type="submit"
              onClick={this.endGame}
            >
              End game
            </button>
            {this.state.muted ? (
              <button
                title="mute"
                className="button6 buttonMute"
                type="button"
                onClick={() => {
                  this.setState({muted: false})
                }}
              >
                Unmute
              </button>
            ) : (
              <button
                className="button6 buttonMute"
                type="button"
                onClick={() => {
                  this.setState({muted: true})
                }}
              >
                Mute
              </button>
            )}
          </div>
        </div>
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
    getNewQuestion: (slug, gameName) =>
      dispatch(getNewQuestion(slug, gameName)),
    endGameThunk: slug => dispatch(endGameThunk(slug))
  }
}

export default connect(mapState, mapDispatch)(HostPlaying)
