import firebase from 'firebase'
const config = {
  apiKey: 'AIzaSyC06e0qnZ45BnyVL8mvGC1BC24aoedgRBk',
  authDomain: 'guava-stackbox.firebaseapp.com',
  databaseURL: 'https://guava-stackbox.firebaseio.com',
  projectId: 'guava-stackbox',
  storageBucket: 'guava-stackbox.appspot.com',
  messagingSenderId: '173449434888'
}

firebase.initializeApp(config)
const database = firebase.database()
export default database
