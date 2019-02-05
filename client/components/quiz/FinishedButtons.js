import React from 'react'
import {Link} from 'react-router-dom'

const FinishedButtons = props => {
  let secondButton
  if (props.secondButton === 'join') {
    secondButton = (
      <Link to="/join">
        <button className="button6 buttonJoin" type="button">
          <h4>Join New Game</h4>
        </button>
      </Link>
    )
  } else if (props.secondButton === 'create') {
    secondButton = (
      <Link to="/newGame">
        <button
          className="button6 buttonNewGame"
          type="button"
          onClick={props.resetGame}
        >
          <h4>Play Again</h4>
        </button>
      </Link>
    )
  }

  return (
    <div className="finished-button-container">
      <Link to="/">
        <button className="button6 buttonHome" type="button">
          <h4>Back to home</h4>
        </button>
      </Link>
      {secondButton}
    </div>
  )
}

export default FinishedButtons
