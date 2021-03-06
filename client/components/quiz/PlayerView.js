/* eslint-disable complexity */
import React from 'react'
import database from '../../firebase'
import {setResponseThunk} from '../../store/user'
import Welcome from '../Welcome'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import PlayerDisconnected from '../game/PlayerDisconnected'
import PlayerRemoved from '../game/PlayerRemoved'
import PlayerFinished from './PlayerFinished'
import PlayerChoices from './PlayerChoices'

class PlayerView extends React.Component {
  constructor() {
    super()
    this.state = {
      gameStatus: 'waiting',
      gameName: null,
      currentQuestion: null,
      answerChoices: [],
      responses: {},
      answeredCurrent: false,
      currentScore: 0,
      redirectHome: false
    }
    this.setState = this.setState.bind(this)
    this.setChoice = this.setChoice.bind(this)
    this.submitChoice = this.submitChoice.bind(this)
  }

  // Can select between an answer multiple times...
  setChoice(event) {
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
    this.setState({answeredCurrent: true})
  }

  async initializeState() {
    const ROOM = `/rooms/${this.props.slug}`
    const ACTIVE_GAME = ROOM + '/active_game'

    // Get reference to player array: used to watch changes
    const playerRef = await database.ref(
      `${ROOM}/players/${this.props.user.uid}`
    )

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

    // Listens for changes in players; if this particular player is missing, render no-longer-playing screen
    await playerRef.on('value', snapshot => {
      if (!snapshot.val()) {
        this.setState({gameStatus: 'non-participant'})
        setTimeout(() => this.setState({redirectHome: true}), 5000)
      }
    })

    // Listens to changes of the currentQuestion
    await currentQuestionRef.on('value', async snapshot => {
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
      if (snapshot.val() === 'playing') {
        this.setState({gameStatus: snapshot.val(), responses: {}})
      } else {
        this.setState({gameStatus: snapshot.val()})
      }
    })

    database
      .ref(`${ROOM}/players/${this.props.user.uid}/currentScore`)
      .on('value', snapshot => {
        this.setState({currentScore: snapshot.val()})
      })
  }

  componentDidMount() {
    this.initializeState()
  }

  componentDidUpdate(prevProps) {
    if (this.props.slug !== prevProps.slug) {
      this.initializeState()
    }
  }

  render() {
    if (!this.props.user.uid) {
      return <Welcome />
    }
    const numCorrect = this.state.currentScore
    const numIncorrect = Object.keys(this.state.responses).length - numCorrect

    const answerData = [
      {name: 'Correct', value: numCorrect},
      {name: 'Incorrect', value: numIncorrect}
    ]

    // We want to disable the submit button if there has been no selected response OR if the player has already selected a response
    const NoSelectedCurrent = !this.state.responses[this.state.currentQuestion]

    if (this.state.gameStatus === 'waiting') {
      return <h1 id="player-waiting">Waiting to start...</h1>
    } else if (
      this.state.gameStatus === 'playing' &&
      this.state.answerChoices
    ) {
      //show answer choices
      return (
        <React.Fragment>
          {this.state.answeredCurrent ? (
            <h1 id="player-submit">Submitted!</h1>
          ) : (
            <PlayerChoices
              submitChoice={this.submitChoice}
              setChoice={this.setChoice}
              answerChoices={this.state.answerChoices}
              NoSelectedCurrent={NoSelectedCurrent}
            />
          )}
        </React.Fragment>
      )
    } else if (this.state.gameStatus === 'finished') {
      return <PlayerFinished answerData={answerData} numCorrect={numCorrect} />
    } else if (this.state.gameStatus === 'non-participant') {
      if (this.state.redirectHome) return <Redirect to="/" />
      else return <PlayerRemoved />
      // Change this to "is_active_game"
    } else if (!this.state.gameStatus) {
      return <PlayerDisconnected />
    } else {
      return null
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
