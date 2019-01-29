import React from 'react'
import {connect} from 'react-redux'
import firebase from '../firebase'
const database = firebase.database()

export default class HostView extends React.Component {
  // constructor(props) {
  //   super(props)
  // }

  render() {
    return (
      <div>
        <h1>code: {this.props.slug}</h1>
        <ul>
          {this.props.players.map((player, i) => {
            let pid = Object.keys(player)[0]
            return <li key={i + ''}> {player[pid].displayName}</li>
          })}
        </ul>
      </div>
    )
  }
}
