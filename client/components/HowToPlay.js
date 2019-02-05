import React from 'react'
import {Link} from 'react-router-dom'

const HowToPlay = () => {
  return (
    <div className="display-static">
      <h2 className="center">How to play</h2>

      <div className="how-to-play-step">
        <h3>Step 1:</h3>
        <p>
          On a bigger device, preferably a computer monitor or tv screen with
          internet capabilities, click{' '}
          <span className="instructions">CREATE NEW GAME</span>.
        </p>
      </div>

      <div className="how-to-play-step">
        <h3>Step 2:</h3>
        <p>
          Pick the game you wish to play and{' '}
          <span className="instructions">CREATE GAME ROOM</span>. A game code
          will be generated.
        </p>
      </div>

      <div className="how-to-play-step">
        <h3>Step 3:</h3>
        <p>
          All players can now use another device (i.e a phone) and click{' '}
          <span className="instructions">JOIN GAME</span>. Enter the game code.
        </p>
      </div>

      <div className="how-to-play-step">
        <h3>Step 4:</h3>
        <p>
          Once all players are in the room, click{' '}
          <span className="instructions">START GAME</span> in the room screen
          and enjoy!
        </p>
      </div>

      <Link to="/" className="center-button">
        <button className="button6 buttonHome" type="button">
          <h4>Back to home</h4>
        </button>
      </Link>
      <div id="logo-holder">
        <img src="./img/cartoon-box.png" />
      </div>
    </div>
  )
}

export default HowToPlay
