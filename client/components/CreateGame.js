import React from 'react'
import {Link, withRouter} from 'react-router-dom'

const CreateGame = () => {
  return (
    <div>
      <Link to="./home">Back to home</Link>
      <div align="center">
        <button type="button">Get Code</button>
      </div>
    </div>
  )
}

export default withRouter(CreateGame)
