import React from 'react'
import {withRouter} from 'react-router-dom'
import {Navbar} from './'

const Welcome = () => {
  return (
    <div align="center">
      <h1>Welcome to Stackbox!</h1>
      <h3>Where people come to play!</h3>
      <Navbar />
    </div>
  )
}

export default withRouter(Welcome)
