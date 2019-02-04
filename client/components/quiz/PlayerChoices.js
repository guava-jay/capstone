import React from 'react'

const PlayerChoices = props => (
  <div id="player-choice-container">
    <h2>Choose carefully...</h2>
    <form onSubmit={props.submitChoice} onChange={props.setChoice}>
      {props.answerChoices.map(choice => (
        <label key={choice}>
          <input type="radio" name="choices" value={choice} />
          <p>{choice}</p>
        </label>
      ))}
      <br />
      <button
        title="submit answer"
        className="button6"
        type="submit"
        disabled={props.NoSelectedCurrent}
        onClick={props.submitChoice}
      >
        Submit choice
      </button>
    </form>
  </div>
)

export default PlayerChoices
