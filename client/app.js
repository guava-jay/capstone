import React from 'react'
import firebase from './firebase'
import {Navbar} from './components'
import Routes from './routes'

// Front-end firebase is firebase.database()
const database = firebase.database()

// Write from the front end (we won't really be doing this)
/*
function writeUserData(userId, name, email, imageUrl) {
  firebase
    .database()
    .ref('users/2')
    .set({
      username: 'Eve',
      email: 'beep',
      profile_picture: 'imageUrl'
    })
}
*/

// Read from the front end
/*
function readData () {
    database
    .ref('/users')
    .once('value')
    .then(function(snapshot) {
      console.log(snapshot.val())
    })
  }
*/

const App = () => {
  // writeUserData()
  // readData()

  return (
    <div>
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
