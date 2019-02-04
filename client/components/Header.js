import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {endGameThunk} from '../store/game'

const Header = props => {
  const deleteCurrentGame = () => {
    if (props.role === 'host') {
      props.endGameThunk(props.slug)
    }
  }
  return (
    <h1 id="header">
      <Link to="/" title="home" onClick={deleteCurrentGame}>
        <span className="yellowFont">Stackbox {'\u00A0'}</span>
        <span className="pinkFont">Games</span>
      </Link>
    </h1>
  )
}

const mapState = state => {
  return {
    slug: state.game.slug,
    role: state.user.role
  }
}
const mapDispatch = dispatch => {
  return {
    endGameThunk: slug => dispatch(endGameThunk(slug))
  }
}
export default connect(mapState, mapDispatch)(Header)
