import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => (
  <div align="center">
    <nav className="links">
      <Link to="/join">
        <h4>Join a Game</h4>
      </Link>
      <Link to="/newGame">
        <h4>Create New Game</h4>
      </Link>
    </nav>
  </div>
)

export default Navbar
