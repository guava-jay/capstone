import React from 'react'
import {withRouter} from 'react-router-dom'

const Join = () => {
  console.log('at join component')
  return (
    <form /*onSubmit={x}*/>
      <label htmlFor="code">Enter your Game Room Code</label>
      <input name="code" defaultValue="####" />
    </form>
  )
}

export default withRouter(Join)
