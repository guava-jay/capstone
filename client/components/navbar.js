import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => (
  <div align="center">
    <nav className="links">
      <Link to="/join" title="join game">
        <h4>Join Game</h4>
      </Link>
      <Link to="/newGame" title="create new game">
        <h4>Create New Game</h4>
      </Link>
      <div className="box">
        <img src="/img/cartoon-box.png" />
      </div>
    </nav>
  </div>
)

export default Navbar
