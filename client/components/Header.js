import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {endGameThunk} from '../store/game'
import {deletePlayerThunk} from '../store/user'

const Header = props => {
  const deleteCurrentUser = () => {
    if (props.role === 'host') {
      props.endGameThunk(props.slug)
    }
    if (props.role === 'player') {
      props.deletePlayerThunk(props.slug, props.uid)
    }
  }
  return (
    <h1 id="header">
      <Link to="/" title="home" onClick={deleteCurrentUser}>
        <span className="yellowFont">Stackbox {'\u00A0'}</span>
        <span className="pinkFont">Games</span>
      </Link>
    </h1>
  )
}

const mapState = state => {
  return {
    slug: state.game.slug,
    role: state.user.role,
    uid: state.user.uid
  }
}
const mapDispatch = dispatch => {
  return {
    endGameThunk: slug => dispatch(endGameThunk(slug)),
    deletePlayerThunk: (slug, uid) => dispatch(deletePlayerThunk(slug, uid))
  }
}
export default connect(mapState, mapDispatch)(Header)
