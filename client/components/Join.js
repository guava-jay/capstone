import React from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {joinGameThunk} from '../store/user'
// eslint-disable-next-line

const MAX_PLAYERS = 4

class Join extends React.Component {
  constructor() {
    super()

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(e) {
    e.preventDefault()
    e.persist()

    if (!e.target.code.value) {
      alert('Please enter a code.')
      return
    }
    if (!e.target.playerName.value) {
      alert('Please enter a name.')
      return
    }
    const code = e.target.code.value.toUpperCase()
    await this.props.joinGameThunk(
      //add player
      code,
      this.props.user.uid,
      e.target.playerName.value
    )
  }

  componentDidUpdate() {
    if (this.props.user.errorMsg) {
      alert(this.props.user.errorMsg)
    }
  }

  render() {
    return (
      <div id="join-container">
        <h1>Join a Game</h1>
        <form id="join-form" onSubmit={this.handleSubmit}>
          <label htmlFor="code">Game Room Code :</label>
          <input name="code" placeholder="####" />
          <label htmlFor="playerName">Player Name :</label>
          <input name="playerName" placeholder="Stackbox" />
          <button title="join game" className="button6" type="submit">
            Join
          </button>
        </form>
        <div id="logo-holder">
          <img src="./img/cartoon-box.png" />
        </div>
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
