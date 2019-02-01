import React from 'react'
import {withRouter} from 'react-router-dom'
import {Navbar} from './'

const Welcome = () => {
  return (
    <div className="welcome" align="center">
      <div id="welcome-title-container">
        <h1 className="welcome-title">Welcome to Stackbox Games!</h1>
        <p>Where people come to play!</p>
      </div>
      <div className="welcome-container">
        <Navbar />
      </div>
    </div>
  )
}

export default withRouter(Welcome)
