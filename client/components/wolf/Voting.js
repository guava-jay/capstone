import React from 'react'
import {getPlayersThunk, voteForPlayerThunk} from '../../store/game_helpers'
import {connect} from 'react-redux'

class Voting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  async componentDidMount() {
    await this.props.getPlayersThunk(this.props.slug, this.props.uid)
    this.setState({loaded: true})
  }

  render() {
    return (
      <div>
        {this.state.loaded && (
          <div>
            {Object.keys(this.props.game_helpers.players).map(key => {
              return (
                <li key={key}>
                  {this.props.game_helpers.players[key].displayName}
                </li>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    game_helpers: state.game_helpers
  }
}

const mapDispatch = dispatch => {
  return {
    getPlayersThunk: (slug, uid) => dispatch(getPlayersThunk(slug, uid)),
    voteForPlayerThunk: (slug, uid, playerId) =>
      dispatch(voteForPlayerThunk(slug, uid, playerId))
  }
}

export default connect(mapState, mapDispatch)(Voting)
