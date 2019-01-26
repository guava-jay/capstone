import React from 'react'
import {connect} from 'react-redux'
import firebase from 'firebase'
const database = firebase.database()

class Room extends React.Component {
  componentDidMount() {
    database
      .ref('/rooms')
      .once('value')
      .then(snapshot => {
        if (!snapshot.hasChild(this.props.match.params.slug)) {
          this.props.history.push('/')
        }
      })
  }

  render() {
    console.log(this.props, 'props')
    return <h1>hi room</h1>
  }
}

const mapState = state => {
  return {
    slug: state.game.slug
  }
}

export default connect(mapState)(Room)
