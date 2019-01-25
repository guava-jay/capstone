import React from 'react'
import {connect} from 'react-redux'
import {setPlayerThunk} from '../store/user'

class Anon extends React.Component {
  componentDidMount() {
    this.props.setPlayerThunk('ABDEF', 'Bob')
  }

  componentWill

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

export default connect(null, mapDispatch)(Anon)
