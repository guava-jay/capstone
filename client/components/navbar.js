import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => (
  <div className="links">
    <Link to="/join">
      <h4>Join Game</h4>
    </Link>
    <Link to="/newGame">
      <h4>Create New Game</h4>
    </Link>
    <Link to="/how-to-play">
      <h4>How To Play</h4>
    </Link>
    <Link to="/about">
      <h4>About</h4>
    </Link>
    <div className="box">
      <img src="/img/cartoon-box.png" />
    </div>
  </div>
)

export default Navbar
