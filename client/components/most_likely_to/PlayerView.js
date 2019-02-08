/* eslint-disable complexity */
import React from 'react'
import database from '../../firebase'
import {setResponseThunk} from '../../store/user'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {Voting} from '../../components'
import axios from 'axios'
import FinishedButtons from '../game/FinishedButtons'
import PlayerDisconnected from '../game/PlayerDisconnected'
import PlayerRemoved from '../game/PlayerRemoved'

class PlayerView extends React.Component {
  constructor() {
    super()
    this.state = {
      gameStatus: 'waiting',
      currentQuestion: null,
      currentChoice: null,
      otherPlayers: [],
      submitted: false,
      wonRounds: [],
      redirectHome: false
    }
    this.setState = this.setState.bind(this)
    this.setChoice = this.setChoice.bind(this)
    this.submitChoice = this.submitChoice.bind(this)
  }

  async initializeState() {
    const ROOM = `/rooms/${this.props.slug}`
    const ACTIVE_GAME = ROOM + '/active_game'

    const playerRef = await database.ref(
      `${ROOM}/players/${this.props.user.uid}`
    )
    const currentQuestionRef = await database.ref(
      `${ACTIVE_GAME}/current_question`
    )
    const allPlayersRef = await database.ref(`${ROOM}/players/`)
    const gameStatusRef = await database.ref(`${ROOM}/status`)

    // Get initial game status
    const gameStatus = await gameStatusRef
      .once('value')
      .then(snapshot => snapshot.val())

    const otherPlayers = await allPlayersRef
      .once('value')
      .then(snapshot => Object.keys(snapshot.val()))

    const questionList = await database
      .ref(`/game_list/most_likely_to/questions`)
      .once('value')
      .then(snapshot => snapshot.val())

    // Get inital current question
    const currentQuestion = await currentQuestionRef
      .once('value')
      .then(snapshot => questionList[snapshot.val()])

    // Set state based on db
    this.setState({
      gameStatus,
      otherPlayers,
      currentQuestion
    })

    // Listens for changes in players; if this particular player is missing, render no-longer-playing screen
    await playerRef.on('value', snapshot => {
      if (!snapshot.val()) {
        this.setState({gameStatus: 'non-participant'})
        setTimeout(() => this.setState({redirectHome: true}), 5000)
      }
    })
    await allPlayersRef.on('value', snapshot => {
      this.setState({otherPlayers: snapshot.val()})
    })

    // Listens to changes of the gameStatus
    await gameStatusRef.on('value', snapshot => {
      if (snapshot.val() === 'finished') {
        database
          .ref(`${ROOM}/players/${this.props.user.uid}/won`)
          .once('value')
          .then(wonRounds => {
            if (wonRounds.val()) {
              this.setState({
                gameStatus: snapshot.val(),
                wonRounds: Object.keys(wonRounds.val())
              })
            } else {
              this.setState({gameStatus: snapshot.val()})
            }
          })
      } else {
        this.setState({gameStatus: snapshot.val()})
      }
    })

    await currentQuestionRef.on('value', async snapshot => {
      if (snapshot.val() >= 0) {
        await database
          .ref(`game_list/${this.state.gameName}/${snapshot.val()}/choices`)
          .once('value')
          .then(snapshot => snapshot.val())
        this.setState({
          currentQuestion: questionList[snapshot.val()],
          submitted: false
        })
      }
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

  setChoice(event) {
    this.setState({currentChoice: event.target.value})
  }

  async submitChoice(event) {
    event.preventDefault()
    if (!this.state.submitted) {
      await axios.put('/api/most_likely_to/vote', {
        slug: this.props.slug,
        uId: this.props.user.uid,
        playerId: this.state.currentChoice,
        currentQuestion: this.state.currentQuestion
      })
      this.setState({submitted: true, currentChoice: null})
    }
  }

  render() {
    if (this.state.gameStatus === 'waiting') {
      return <h1 id="player-waiting">Waiting to start...</h1>
    } else if (this.state.gameStatus === 'playing') {
      //show answer choices
      return (
        <React.Fragment>
          {this.state.submitted ? (
            <h1 id="player-submit">Submitted!</h1>
          ) : (
            <Voting
              slug={this.props.slug}
              otherPlayers={this.state.otherPlayers}
              setChoice={this.setChoice}
              submitChoice={this.submitChoice}
              currentChoice={this.state.currentChoice}
            />
          )}
        </React.Fragment>
      )
    } else if (this.state.gameStatus === 'finished') {
      let endDisplay

      if (!this.state.wonRounds.length) {
        endDisplay = (
          <div className="center">
            <h2>...sorry, you didn't win any rounds this time!</h2>
            <p>But WE vote you "most likely to play again" :-)</p>
          </div>
        )
      } else {
        endDisplay = (
          <div className="player-list">
            {this.state.wonRounds.map(won => <li key={won}>{won}</li>)}
          </div>
        )
      }

      return (
        <div id="player-finished">
          <div className="center">
            <h1>You're done!</h1>
            <h2>You were voted most likely to...</h2>
          </div>
          {endDisplay}
          <FinishedButtons />
        </div>
      )
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
