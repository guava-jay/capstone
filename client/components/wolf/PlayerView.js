import React from 'react'
import database from '../../firebase'
import {setResponseThunk} from '../../store/user'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import Navbar from '../navbar'
import {Voting} from '../../components'

class PlayerView extends React.Component {
  constructor() {
    super()
    this.state = {
      gameStatus: 'waiting',
      voting: false,
      role: '',
      otherPlayers: []
    }
    this.setState = this.setState.bind(this)
    // this.setChoice = this.setChoice.bind(this)
    // this.submitChoice = this.submitChoice.bind(this)
  }

  // Can select between an answer multiple times...
  // setChoice(event) {
  //   const currentQuestion = this.state.currentQuestion
  //   const currentResponse = event.target.value
  //   const responses = {
  //     ...this.state.responses,
  //     [currentQuestion]: currentResponse
  //   }
  //   this.setState({responses})
  // }

  // ...But can only submit once per question
  // submitChoice(event) {
  //   event.preventDefault()

  //   const slug = this.props.slug
  //   const uid = this.props.user.uid

  //   const currentQuestion = this.state.currentQuestion
  //   const answer = this.state.responses[currentQuestion]
  //   this.props.setResponseThunk(slug, uid, answer)
  //   this.setState({answeredCurrent: true})
  // }

  async initializeState() {
    const ROOM = `/rooms/${this.props.slug}`
    const ACTIVE_GAME = ROOM + '/active_game'

    // Get reference to player array: used to watch changes
    const playerRef = await database.ref(
      `${ROOM}/players/${this.props.user.uid}`
    )

    const allPlayers = await database.ref(`${ROOM}/players/`)
    // Get reference to game status
    const gameStatusRef = await database.ref(`${ROOM}/status`)

    // Get initial game status
    const gameStatus = await gameStatusRef
      .once('value')
      .then(snapshot => snapshot.val())

    const otherPlayers = await allPlayers
      .once('value')
      .then(snapshot => snapshot.val())

    // Set state based on db
    this.setState({
      gameStatus,
      otherPlayers
    })

    // Listens for changes in players; if this particular player is missing, render no-longer-playing screen
    await playerRef.on('value', snapshot => {
      if (!snapshot.val()) {
        this.setState({gameStatus: 'non-participant'})
      }
    })
    await allPlayers.on('value', snapshot => {
      this.setState({otherPlayers: snapshot.val()})
    })

    // // Listens to changes of the currentQuestion
    // await currentQuestionRef.on('value', async snapshot => {
    //   if (snapshot.val() >= 0) {
    //     const answerChoices = await database
    //       .ref(`game_list/${this.state.gameName}/${snapshot.val()}/choices`)
    //       .once('value')
    //       .then(snapshot => snapshot.val())
    //     this.setState({
    //       currentQuestion: snapshot.val(),
    //       answerChoices,
    //       answeredCurrent: false
    //     })
    //   }
    // })

    // Listens to changes of the gameStatus
    gameStatusRef.on('value', snapshot => {
      this.setState({gameStatus: snapshot.val()})
    })

    // database
    //   .ref(`${ROOM}/players/${this.props.user.uid}/currentScore`)
    //   .on('value', snapshot => {
    //     this.setState({currentScore: snapshot.val()})
    //   })
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
    // We want to disable the submit button if there has been no selected response OR if the player has already selected a response
    // const NoSelectedCurrent = !this.state.responses[this.state.currentQuestion]
    if (this.state.gameStatus === 'waiting') {
      return <h1 id="player-waiting">Waiting to start...</h1>
    } else if (this.state.gameStatus === 'playing') {
      //show answer choices
      return (
        <Voting slug={this.props.slug} otherPlayers={this.state.otherPlayers} />
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
