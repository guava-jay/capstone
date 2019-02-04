import React from 'react'
import {Link} from 'react-router-dom'

const JoinCreateButtons = () => (
  <div className="buttonContainer" align="center">
    <nav className="links">
      <Link to="/join" title="join game">
        <h4>Join Game</h4>
      </Link>
      <Link to="/newGame" title="create new game">
        <h4>Create New Game</h4>
      </Link>
    </nav>
  </div>
)

export default JoinCreateButtons
