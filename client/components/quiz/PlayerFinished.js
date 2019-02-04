import React from 'react'
import {PieChart, Pie, Cell, Label} from 'recharts'
import {Link} from 'react-router-dom'

const PlayerFinised = props => (
  <div id="player-finished">
    <h1 className="center">Results</h1>
    <div id="recharts-container">
      <PieChart width={200} height={200}>
        <Pie
          data={props.answerData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={100}
          paddingAngle={0}
          fill="#8884d8"
        >
          <Cell fill="#00C49F" />
          <Cell fill="#ff3860" />
          <Label position="center">{`${props.numCorrect} Correct`}</Label>
        </Pie>
      </PieChart>
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

export default PlayerFinised
