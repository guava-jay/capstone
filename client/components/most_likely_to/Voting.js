import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'

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

  async submitChoice(event) {
    console.log(this.state)
    event.preventDefault()
    if (!this.state.submitted) {
      await axios.put('/api/most_likely_to/vote', {
        slug: this.props.slug,
        uId: this.props.user.uid,
        playerId: this.state.currentChoice
      })
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

export default connect(mapState)(Voting)
