import React from 'react'
import {Link} from 'react-router-dom'

const HowToPlay = () => {
  return (
    <div>
      <h1>How to play</h1>
      <p>
        Step 1 - On a bigger device, preferably a computer monitor or tv screen
        with internet capabilities, click create new game.
      </p>
      <p>
        Step 2 - Pick the game you wish to play and create game room. A game
        code will be generated
      </p>
      <p>
        Step 3 - All players can now get on another device (i.e your phone) and
        click join game. Enter your game code.
      </p>
      <p>
        Step 4 - Once all players are in the room, click start game in the room
        screen and enjoy!
      </p>
      <Link to="/">
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
