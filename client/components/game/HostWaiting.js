import React from 'react'

const HostWaiting = props => {
  const {slug, players, startGame, ready} = props

  return (
    <div id="host-view-container">
      <h1>CODE : {props.slug}</h1>
      <div id="list-player-host-container">
        <h2>Players</h2>
        {!players.length ? (
          <h3>Waiting for players to join...</h3>
        ) : (
          <ul>
            {players.map((player, i) => {
              let pid = Object.keys(player)[0]
              return (
                <div key={i + ''}>
                  <li>
                    <p>
                      <i
                        onClick={e => {
                          this.deletePlayer(pid)
                        }}
                        className="fas fa-times icon-move"
                      />
                      {player[pid].displayName}
                    </p>
                  </li>
                </div>
              )
            })}
          </ul>
        )}
      </div>
      <button
        title="start game"
        className="button6"
        type="button"
        onClick={startGame}
        disabled={!ready}
      >
        Start Game
      </button>
      <img
        className="qr-code"
        src={`https://api.qrserver.com/v1/create-qr-code/?data=stackbox.herokuapp.com/join/${slug}`}
        alt=""
        title=""
      />
    </div>
  )
}

export default HostWaiting
