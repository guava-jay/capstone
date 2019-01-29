import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {joinGameThunk} from '../store/user'
import firebase from '../firebase'
const database = firebase.database()

class Join extends React.Component {
  constructor() {
    super()
    this.state = {
      gameExists: false,
      gameFull: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    //query DB for game
    let gameRef = database.ref(`/rooms/${e.target.code.value}`)
    gameRef.on('value', gameSnap => {
      if (gameSnap.val()) {
        ///if game/slug exists
        this.setState({gameExists: true}) //set gameExists to true
      }
    })
    //query DB for players in game
    if (this.state.gameExists) {
      //if the game exists, check if full
      let playersRef = database.ref(`/rooms/${this.props.slug}/players`)
      playersRef.on(
        'value',
        playerSnap => {
          if (playerSnap.val()) {
            //if more than 0 players
            let playerKeys = Object.keys(playerSnap.val())
            if (playerKeys.length >= 4) {
              //check length; if full...
              this.setState({gameFull: true}) //...set gameFull to true
            }
          }
        },
        errorObject => {
          console.log('The read failed:', errorObject.code)
        }
      )
    }

    if (this.state.gameExists) {
      //if game exists
      if (this.state.gameFull) {
        //if full
        alert('Error: game room is full') //return error message
      } else {
        //otherwise
        this.props.joinGameThunk(
          //add player
          e.target.code.value,
          this.props.user.uid,
          e.target.playerName.value
        )
      }
    } else {
      //if game doesn't exist
      alert('Error: invalid game code') //return error message
    }
  }

  render() {
    return (
      <div>
        <Link to="./home">Back to home</Link>
        <form align="center" onSubmit={this.handleSubmit}>
          <label htmlFor="playerName">Create your player name</label>
          <input name="playerName" />
          <label htmlFor="code">Enter your Game Room Code</label>
          <input name="code" placeholder="####" />
          <button type="submit">Join</button>
        </form>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    joinGameThunk: (slug, uid, displayName) =>
      dispatch(joinGameThunk(slug, uid, displayName))
  }
}

export default withRouter(connect(mapState, mapDispatch)(Join))
