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
    console.log(e, 'handle changel')
    this.setState({
      selectedGame: e
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
    return (
      <div id="create-game-container">
        <h1>Create a Game</h1>
        <form onSubmit={this.handleSubmit}>
          {this.state.allGames.length ? (
            <React.Fragment>
              <p>Select a game :</p>
              <div id="list-games-container">
                {this.state.allGames.map(x => {
                  return (
                    <div
                      id={this.state.selectedGame === x ? 'selectedGame' : ''}
                      onClick={() => this.handleChange(x)}
                      className="list-games"
                      key={x}
                    >
                      <h3>{x}</h3>
                    </div>
                  )
                })}
                {/* PLACEHOLD TESTS */}
                <div
                  id={
                    this.state.selectedGame === 'test 1' ? 'selectedGame' : ''
                  }
                  onClick={() => this.handleChange('test 1')}
                  className="list-games"
                >
                  <h3>test 1</h3>
                </div>
                <div
                  id={
                    this.state.selectedGame === 'test 2' ? 'selectedGame' : ''
                  }
                  onClick={() => this.handleChange('test 2')}
                  className="list-games"
                >
                  <h3>test 2</h3>
                </div>
                <div
                  id={
                    this.state.selectedGame === 'test 3' ? 'selectedGame' : ''
                  }
                  onClick={() => this.handleChange('test 3')}
                  className="list-games"
                >
                  <h3>test 3</h3>
                </div>
                <div
                  id={
                    this.state.selectedGame === 'test 4' ? 'selectedGame' : ''
                  }
                  onClick={() => this.handleChange('test 4')}
                  className="list-games"
                >
                  <h3>test 4</h3>
                </div>
                {/* PLACEHOLD TESTS */}
              </div>
            </React.Fragment>
          ) : null}
          <button title="create game" className="button6" type="submit">
            Create game room
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
const mapDispatch = dispatch => ({
  createNewGame: (uid, game) => dispatch(createNewGame(uid, game))
})

export default withRouter(connect(mapState, mapDispatch)(CreateGame))
