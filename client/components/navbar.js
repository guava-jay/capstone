import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => (
  <div align="center">
    <nav>
      <Link to="/join">Join a Game</Link>
      <Link to="/newGame">Create a New Game</Link>
    </nav>
  </div>
)

export default Navbar
