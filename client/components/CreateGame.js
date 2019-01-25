import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {createNewGame} from '../store/game'

class CreateGame extends Component {
  addNewGame = () => {
    console.log('addNewGame onClick running')
    let arr = []
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let i = 0; i < 8; i++) {
      const index = Math.floor(36 * Math.random())
      arr.push(chars[index])
    }
    let slug = arr.join('')
    this.props.createNewGame(slug)
  }

  render() {
    return (
      <div>
        <Link to="./home">Back to home</Link>
        <div align="center">
          <button type="button" onClick={this.addNewGame}>
            Get Code
          </button>
        </div>
      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  createNewGame: slug => dispatch(createNewGame(slug))
})

export default withRouter(connect(null, mapDispatch)(CreateGame))
