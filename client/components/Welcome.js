import React from 'react'
import {withRouter} from 'react-router-dom'
import {Navbar} from './'

const Welcome = () => {
  return (
    <div className="welcome" align="center">
      <div>
        <h1>Welcome to Stackbox!</h1>
        <h3>Where people come to play!</h3>
      </div>
      <div className="welcome-container">
        <Navbar />
        <div className="box">
          <img src="/img/cartoon-box.png" />
        </div>
      </div>
    </div>
  )
}

export default withRouter(Welcome)
