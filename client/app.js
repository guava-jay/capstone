import React from 'react'
import {Navbar, Welcome} from './components'
//import Welcome from './components/Welcome'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <Welcome />
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
