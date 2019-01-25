import React from 'react'
import {Link, withRouter} from 'react-router-dom'

const Join = () => {
  return (
    <div>
      <Link to="./home">Back to home</Link>
      <form align="center" /*onSubmit={x}*/>
        <label htmlFor="playerName">Create your player name</label>
        <input name="playerName" />
        <label htmlFor="code">Enter your Game Room Code</label>
        <input name="code" defaultValue="####" />
      </form>
    </div>
  )
}

export default withRouter(Join)
