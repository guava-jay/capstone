import React from 'react'
import FinishedButtons from '../FinishedButtons'

const PlayerDisconnected = () => (
  <div id="player-disconnected">
    <div>
      <h1>The host has disconnected.</h1>
    </div>
    <FinishedButtons secondButton="join" />
  </div>
)

export default PlayerDisconnected
