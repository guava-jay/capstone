import React from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {deleteGameThunk} from '../store/game'
import {deletePlayerThunk} from '../store/user'

const Header = props => {
  const deleteCurrentUser = async () => {
    if (props.role === 'host') {
      await props.deleteGameThunk(props.slug)
    }
    if (props.role === 'player') {
      await props.deletePlayerThunk(props.slug, props.uid)
    }
    props.history.push('/')
  }
  return (
    <h1 id="header">
      <span className="cursor-hover" title="home" onClick={deleteCurrentUser}>
        <span className="yellowFont">Stackbox{'\u00A0'}</span>
        <span className="pinkFont">Games</span>
      </span>
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
    deleteGameThunk: slug => dispatch(deleteGameThunk(slug)),
    deletePlayerThunk: (slug, uid) => dispatch(deletePlayerThunk(slug, uid))
  }
}
export default withRouter(connect(mapState, mapDispatch)(Header))
