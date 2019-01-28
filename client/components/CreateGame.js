import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {createNewGame} from '../store/game'

class CreateGame extends Component {
  render() {
    return (
      <div>
        <Link to="./home">Back to home</Link>
        <div align="center">
          <button
            type="button"
            onClick={() => this.props.createNewGame(this.props.user.uid)}
          >
            Create game room
          </button>
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
const mapDispatch = dispatch => ({
  createNewGame: uid => dispatch(createNewGame(uid))
})

export default withRouter(connect(mapState, mapDispatch)(CreateGame))
