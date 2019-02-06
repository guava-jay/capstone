import React from 'react'

//rewriting this to expect the players as a prop
const Voting = props => {
  return (
    <div id="player-choice-container">
      <form onSubmit={props.submitChoice} onChange={props.setChoice}>
        {Object.keys(props.otherPlayers).map(key => {
          return (
            <label key={key}>
              <input type="radio" name="choices" value={key} />
              <p>{props.otherPlayers[key].displayName}</p>
            </label>
          )
        })}

        <button
          title="submit answer"
          className="button6"
          type="submit"
          disabled={!props.currentChoice}
          onClick={props.submitChoice}
        >
          Submit Choice
        </button>
      </form>
    </div>
  )
}

export default Voting
