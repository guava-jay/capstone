import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {getPlayersThunk} from '../../store/game_helpers'

class Test extends React.Component {
  componentDidMount() {
    this.props.getPlayersThunk('YZ9M')
  }

  render() {
    return <div>check the log</div>
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    getPlayersThunk: slug => dispatch(getPlayersThunk(slug))
  }
}

export default withRouter(connect(mapState, mapDispatch)(Test))
