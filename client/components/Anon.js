import React from 'react'
import {connect} from 'react-redux'
import {setPlayerThunk} from '../store/user'

class Anon extends React.Component {
  componentDidMount() {
    // this.props.setPlayerThunk('ABDEF', 'Bob')
  }

  render() {
    return (
      <div>
        <h1>This is Anon</h1>
      </div>
    )
  }
}

const mapDispatch = dispatch => {
  return {setPlayerThunk: (room, name) => dispatch(setPlayerThunk(room, name))}
}

const mapState = state => ({
  user: state.user
})

export default connect(mapState, mapDispatch)(Anon)