import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {joinGameThunk} from '../store/user'

class Join extends React.Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    //something to check # of players in game
    //if (players exists && if players.length>4 )
    this.props.joinGameThunk(
      e.target.code.value,
      this.props.user.uid,
      e.target.playerName.value
    )
    //else{
    //alert: no more room
    //}
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
