import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => (
  <div align="center">
    <nav className="links">
      <Link to="/join">
        <h4>Join Game</h4>
      </Link>
      <Link to="/newGame">
        <h4>Create New Game</h4>
      </Link>
      <div className="box">
        <img src="/img/cartoon-box.png" />
      </div>
    </nav>
  </div>
)

export default Navbar
