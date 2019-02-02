import React from 'react'
import {Link} from 'react-router-dom'

const Header = props => {
  return (
    <h1 id="header">
      <Link to="/" title="home">
        <span className="yellowFont">Stackbox {'\u00A0'}</span>
        <span className="pinkFont">Games</span>
      </Link>
    </h1>
  )
}

export default Header
