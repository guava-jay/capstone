import React from 'react'
import firebase from '../firebase'
const database = firebase.database()

export default class HostFinished extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    database
      .ref(`/rooms/${this.props.slug}/players`)
      .once('value')
      .then(snapshot => console.log(snapshot.val()))
  }

  render() {
    return <div>Finished</div>
  }
}
