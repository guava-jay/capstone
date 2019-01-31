import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {joinGameThunk} from '../store/user'
import firebase from '../firebase'
const database = firebase.database()
// eslint-disable-next-line

const MAX_PLAYERS = 4

class Join extends React.Component {
  constructor() {
    super()

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.persist()
    e.preventDefault()

    if (!e.target.code.value) {
      alert('please enter a code')
      return
    }
    if (!e.target.playerName.value) {
      alert('please enter a name')
      return
    }
    const code = e.target.code.value.toUpperCase()
    this.props.joinGameThunk(
      //add player
      code,
      this.props.user.uid,
      e.target.playerName.value
    )
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
          <p>
            <button type="submit">Join</button>
          </p>
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
