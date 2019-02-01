import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {createNewGame} from '../store/game'
import firebase from '../firebase'

class CreateGame extends Component {
  constructor() {
    super()
    this.state = {
      allGames: [],
      selectedGame: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  async componentDidMount() {
    const gameRef = firebase.ref(`/game_list`)
    let test
    await gameRef.once('value').then(snapshot => {
      test = Object.keys(snapshot.val())
    })
    this.setState({allGames: test})
  }

  handleChange(e) {
    this.setState({
      selectedGame: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.state.selectedGame === '') {
      alert('please select a game')
    } else {
      this.props.createNewGame(this.props.user.uid, this.state.selectedGame)
    }
  }
  render() {
    console.log(this.state.allGames, 'all games state')
    return (
      <div>
        <Link to="./home">Back to home</Link>
        <div align="center">
          <form onSubmit={this.handleSubmit}>
            {this.state.allGames.length ? (
              <React.Fragment>
                <p>Select a game :</p>
                <select onChange={this.handleChange}>
                  <option value="" />
                  {this.state.allGames.map(x => {
                    return (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    )
                  })}
                </select>
              </React.Fragment>
            ) : null}
            <button type="submit">Create game room</button>
          </form>
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
  createNewGame: (uid, game) => dispatch(createNewGame(uid, game))
})

export default withRouter(connect(mapState, mapDispatch)(CreateGame))
