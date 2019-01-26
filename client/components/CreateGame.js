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
          <button type="button" onClick={() => this.props.createNewGame()}>
            Create game room
          </button>
        </div>
      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  createNewGame: () => dispatch(createNewGame())
})

export default withRouter(connect(null, mapDispatch)(CreateGame))
