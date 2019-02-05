import React from 'react'
import {voteForPlayerThunk} from '../../store/game_helpers'
import {connect} from 'react-redux'

//rewriting this to expect the players as a prop
class Voting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentChoice: false,
      submitted: false
    }
    this.setChoice = this.setChoice.bind(this)
    this.submitChoice = this.submitChoice.bind(this)
  }

  setChoice(event) {
    this.setState({currentChoice: event.target.value})
  }

  submitChoice(event) {
    event.preventDefault()
    if (!this.state.submitted) {
      this.props.voteForPlayerThunk(
        this.props.slug,
        this.props.user.uid,
        this.state.currentChoice
      )
      this.setState({submitted: true})
    }
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <form onSubmit={this.submitChoice} onChange={this.setChoice}>
          {Object.keys(this.props.otherPlayers).map(key => {
            return (
              <label key={key}>
                <input type="radio" name="choices" value={key} />
                <p>{this.props.otherPlayers[key].displayName}</p>
              </label>
            )
          })}
          {!this.state.submitted && (
            <button
              title="submit answer"
              className="button6"
              type="submit"
              disabled={!this.state.currentChoice}
              onClick={this.submitChoice}
            >
              Submit Choice{' '}
            </button>
          )}
          {this.state.submitted && (
            <div>You voted for {this.state.currentChoice}</div>
          )}
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
    voteForPlayerThunk: (slug, uid, playerId) =>
      dispatch(voteForPlayerThunk(slug, uid, playerId))
  }
}

export default connect(mapState, mapDispatch)(Voting)
