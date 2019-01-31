import React from 'react'
import database from '../../firebase'
import {setResponseThunk} from '../../store/user'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'

class PlayerView extends React.Component {
  constructor() {
    super()
    this.state = {
      gameStatus: '',
      gameName: null,
      currentQuestion: null,
      answerChoices: [],
      responses: {},
      answeredCurrent: false
    }
    this.setState = this.setState.bind(this)
    this.setChoice = this.setChoice.bind(this)
    this.submitChoice = this.submitChoice.bind(this)
  }

  // Can select between an answer multiple times...
  setChoice(event) {
    event.preventDefault()
    const currentQuestion = this.state.currentQuestion
    const currentResponse = event.target.value
    const responses = {
      ...this.state.responses,
      [currentQuestion]: currentResponse
    }
    this.setState({responses})
  }

  // ...But can only submit once per question
  submitChoice(event) {
    event.preventDefault()

    const slug = this.props.slug
    const uid = this.props.user.uid

    const currentQuestion = this.state.currentQuestion
    const answer = this.state.responses[currentQuestion]
    this.props.setResponseThunk(slug, uid, answer)
  }

  async componentDidMount() {
    const ROOM = `/rooms/${this.props.slug}`
    const ACTIVE_GAME = ROOM + '/active_game'

    // Get reference to current question: used to watch for changes
    const currentQuestionRef = database.ref(`${ACTIVE_GAME}/current_question`)

    // Get reference to game status
    const gameStatusRef = await database.ref(`${ROOM}/status`)

    // Get inital game name
    const gameName = await database
      .ref(`${ACTIVE_GAME}/game_name`)
      .once('value')
      .then(snapshot => snapshot.val())

    // Get initial game status
    const gameStatus = await gameStatusRef
      .once('value')
      .then(snapshot => snapshot.val())

    // Get inital current question
    const currentQuestion = await currentQuestionRef
      .once('value')
      .then(snapshot => snapshot.val())

    // Set state based on db
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
        this.setState({
          currentQuestion: snapshot.val(),
          answerChoices,
          answeredCurrent: false
        })
      }
    })

    // Listens to changes of the gameStatus
    gameStatusRef.on('value', snapshot => {
      console.log('this.state.gameStatus:', this.state.gameStatus)
      this.setState({gameStatus: snapshot.val()})
    })

    // Listens to changes in player's recorded responses

    database
      .ref(`${ROOM}/players/${this.props.user.uid}`)
      .on('value', snapshot => {
        const response = snapshot.val()
        if (response.answers) {
          if (response.answers[this.state.currentQuestion]) {
            this.setState({answeredCurrent: true})
          }
        }
      })
  }

  render() {
    // We want to disable the submit button if there has been no selected response OR if the player has already selected a response
    const NoSelectedCurrent = !this.state.responses[this.state.currentQuestion]
    if (!this.state.gameStatus) {
      return (
        <div>
          <h1>Game has been ended</h1>
          <NavLink to="/">Play again</NavLink>
        </div>
      )
    } else {
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
                      value={choice}
                    >
                      {choice}
                    </button>
                  ))}
                  <br />
                  <button
                    disabled={this.state.answeredCurrent || NoSelectedCurrent}
                    onClick={this.submitChoice}
                  >
                    Submit choice
                  </button>
                  ))}
                  <br />
                  <button
                    type="submit"
                    disabled={this.state.answeredCurrent || NoSelectedCurrent}
                    onClick={this.submitChoice}
                  >
                    Submit choice
                  </button>
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
}

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    setResponseThunk: (slug, uid, answer) =>
      dispatch(setResponseThunk(slug, uid, answer))
  }
}

export default connect(mapState, mapDispatch)(PlayerView)
