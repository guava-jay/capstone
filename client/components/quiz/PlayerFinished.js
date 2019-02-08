import React from 'react'
import {PieChart, Pie, Cell, Label} from 'recharts'
import FinishedButtons from '../game/FinishedButtons'

const PlayerFinished = props => {
  const noData = !props.answerData[0].value && !props.answerData[1].value
  let graph

  if (noData) {
    graph = <h1 id="no-results">No answer results to display.</h1>
  } else {
    graph = (
      <div>
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
      </div>
    )
  }

  return (
    <div id="player-finished">
      {graph}
      <FinishedButtons secondButton="join" />
    </div>
  )
}

export default PlayerFinished
