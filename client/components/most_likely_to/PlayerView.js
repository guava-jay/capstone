import React from 'react'
import database from '../../firebase'
import {setResponseThunk} from '../../store/user'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import {Voting} from '../../components'
import axios from 'axios'

class PlayerView extends React.Component {
  constructor() {
    super()
    this.state = {
      gameStatus: 'waiting',
      currentQuestion: null,
      currentChoice: null,
      otherPlayers: [],
      submitted: false
    }
    this.setState = this.setState.bind(this)
    this.setChoice = this.setChoice.bind(this)
    this.submitChoice = this.submitChoice.bind(this)
  }

  async initializeState() {
    const ROOM = `/rooms/${this.props.slug}`
    const ACTIVE_GAME = ROOM + '/active_game'

    const playerRef = database.ref(`${ROOM}/players/${this.props.user.uid}`)
    const currentQuestionRef = database.ref(`${ACTIVE_GAME}/current_question`)
    const allPlayersRef = database.ref(`${ROOM}/players/`)
    const gameStatusRef = database.ref(`${ROOM}/status`)

    // Get initial game status
    const gameStatus = await gameStatusRef
      .once('value')
      .then(snapshot => snapshot.val())

    const otherPlayers = await allPlayersRef
      .once('value')
      .then(snapshot => snapshot.val())

    // Get inital current question
    const currentQuestion = await currentQuestionRef
      .once('value')
      .then(snapshot => snapshot.val())

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
      }
    })
    await allPlayersRef.on('value', snapshot => {
      this.setState({otherPlayers: snapshot.val()})
    })

    // Listens to changes of the gameStatus
    await gameStatusRef.on('value', snapshot => {
      this.setState({gameStatus: snapshot.val()})
    })

    await currentQuestionRef.on('value', async snapshot => {
      if (snapshot.val() >= 0) {
        const answerChoices = await database
          .ref(`game_list/${this.state.gameName}/${snapshot.val()}/choices`)
          .once('value')
          .then(snapshot => snapshot.val())
        this.setState({
          currentQuestion: snapshot.val(),
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
    console.log(event.target.value)
    this.setState({currentChoice: event.target.value})
  }

  async submitChoice(event) {
    console.log(this.state)
    event.preventDefault()
    if (!this.state.submitted) {
      await axios.put('/api/most_likely_to/vote', {
        slug: this.props.slug,
        uId: this.props.user.uid,
        playerId: this.state.currentChoice
      })
      this.setState({submitted: true})
    }
  }

  render() {
    console.log(this.state)

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
    } else if (this.state.gameStatus === 'non-participant') {
      return <Redirect to="/" />
      // Change this to "is_active_game"
    } else if (!this.state.gameStatus) {
      return (
        <div>
          <h1>Game has been ended</h1>
          <NavLink to="/">Play again</NavLink>
        </div>
      )
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
