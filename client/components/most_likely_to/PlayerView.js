import React from 'react'
import database from '../../firebase'
import {setResponseThunk} from '../../store/user'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import {Voting} from '../../components'

class PlayerView extends React.Component {
  constructor() {
    super()
    this.state = {
      gameStatus: 'waiting',
      otherPlayers: []
    }
    this.setState = this.setState.bind(this)
  }

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

    // Listens to changes of the gameStatus
    gameStatusRef.on('value', snapshot => {
      this.setState({gameStatus: snapshot.val()})
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
