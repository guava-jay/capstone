import React from 'react'
import {connect} from 'react-redux'
import firebase from '../firebase'
const database = firebase.database()

export default class PlayerView extends React.Component {
  render() {
    return <h1> player device waiting for game to start</h1>
  }
}
