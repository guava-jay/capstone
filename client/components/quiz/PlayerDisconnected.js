import React from 'react'
import {Link} from 'react-router-dom'

const PlayerDisconnected = () => (
  <div id="player-disconnected">
    <div>
      <h1>The host has disconnected.</h1>
    </div>
    <div className="finished-button-container">
      <Link to="/">
        <button className="button6 buttonHome" type="button">
          <h4>Back to home</h4>
        </button>
      </Link>

      <Link to="/join">
        <button className="button6 buttonJoin" type="button">
          <h4>Join New Game</h4>
        </button>
      </Link>
    </div>
  </div>
)

export default PlayerDisconnected
