import React from 'react'
import {connect} from 'react-redux'
import database from '../firebase'
import HostView from './game/HostView'
import QuizPlayerView from './quiz/PlayerView'
import MLTPlayerView from './most_likely_to/PlayerView'
import {resetThunk} from '../store/game'

class Room extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedGame: ''
    }
  }

  componentDidMount() {
    //checks to see if room exists
    database
      .ref(`/rooms/${this.props.match.params.slug}`)
      .once('value')
      .then(snapshot => {
        if (!snapshot.val()) {
          this.props.history.push('/')
        } else {
          this.setState({
            selectedGame: snapshot.child('active_game/game_name/').val()
          })
        }
      })
  }

  componentWillUnmount() {
    this.props.resetThunk()
  }

  render() {
    //checking for user disconnect
    if (this.props.user.role === 'host') {
      database
        .ref(`rooms/${this.props.game.slug}`)
        .onDisconnect()
        .remove()
      return <HostView slug={this.props.game.slug} />
      //host device
    }

    // player device
    if (this.props.user.role === 'player') {
      database
        .ref(`rooms/${this.props.game.slug}/players/${this.props.user.uid}`)
        .onDisconnect()
        .remove()
      if (this.state.selectedGame === 'quiz') {
        return <QuizPlayerView slug={this.props.game.slug} />
      } else if (this.state.selectedGame === 'most_likely_to') {
        return <MLTPlayerView slug={this.props.game.slug} />
      }
    }
    return null
  }
}

const mapState = state => {
  return {
    game: state.game,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    resetThunk: () => dispatch(resetThunk())
  }
}

export default connect(mapState, mapDispatch)(Room)
