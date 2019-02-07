/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */
/* eslint-disable complexity */
import React from 'react'
import {connect} from 'react-redux'
import database from '../../firebase'
import {getNewQuestion, endGameThunk} from '../../store/game'

class HostPlaying extends React.Component {
  constructor() {
    super()
    this.state = {
      questionCount: 0,
      question: {},
      count: 0,
      currentQuestionAnswer: null,
      muted: false
    }
    this.updateQuestion = this.updateQuestion.bind(this)
    this.endGame = this.endGame.bind(this)
  }

  async initializeState() {
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

        await database
          .ref(
            `game_list/${this.props.game.gameName}/questions/${snapshot.val()}`
          )
          .once('value')
          .then(snapshot => {
            question = snapshot.val() || null
          })
        this.setState(prevState => {
          return {
            questionCount: prevState.questionCount + 1,
            currentQuestion: snapshot.val(),
            question: {question}
          }
        })
      }
    })

    //listening for answers first and checking them later
    //we still need to add timer here
    const answerRef = database.ref(
      `rooms/${this.props.game.slug}/active_game/current_answers`
    )

    await answerRef.on('value', snapshot => {
      if (snapshot.val()) {
        this.setState(prevState => {
          return {
            count: prevState.count + 1
          }
        })
      }
      if (this.state.count === this.props.players.length) {
        //getWinner
        const votes = database.ref(
          `rooms/${this.props.game.slug}/active_game/current_answers/`
        )
        votes.once('value', snap => {
          let votedFor = Object.values(snap.val())
          //make an object holding votees and # votes they got
          let voteCounts = {}
          votedFor.forEach(person => {
            if (!voteCounts[person]) {
              voteCounts[person] = 1
            } else {
              voteCounts[person]++
            }
          })
          //voteCounts is working
          let winners = []
          let max = Math.max(...Object.values(voteCounts))
          for (let votee in voteCounts) {
            if (voteCounts[votee] === max) {
              winners.push(votee)
            }
          }
          let winnerNames = []
          winners.forEach(uid => {
            database
              .ref(
                `rooms/${this.props.game.slug}/players/${uid}/won/${
                  this.state.question.question
                }`
              )
              .set(true)

            database
              .ref(`rooms/${this.props.game.slug}/players/${uid}`)
              .once('value')
              .then(s => {
                winnerNames.push(s.val().displayName)
              })
              .then(() => {
                this.setState({
                  currentQuestionAnswer: winnerNames.join(' and ')
                })
              })
            document.getElementById('ding').play()
            setTimeout(this.updateQuestion, 3000)
            //set timer to call next question
          })
        })
      }
    })
  } //end initialize state

  componentDidMount() {
    this.initializeState()
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
        {this.state.questionCount === 9 && <h2>One more question!</h2>}
        {this.state.questionCount === 10 && <h2>Last one!</h2>}
        {this.state.question.question ? (
          <div className="host-q-display">
            <h1>Who is the most likely to...</h1>
            <h1>{this.state.question.question}?</h1>
          </div>
        ) : null}
        <div id="question-host-container">
          {this.state.currentQuestionAnswer !== null ? (
            <p className="center">It's {this.state.currentQuestionAnswer}!</p>
          ) : (
            ''
          )}
          {/* show answer or display question */}
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
    getNewQuestion: (slug, gameName) =>
      dispatch(getNewQuestion(slug, gameName)),
    endGameThunk: slug => dispatch(endGameThunk(slug))
  }
}

export default connect(mapState, mapDispatch)(HostPlaying)
