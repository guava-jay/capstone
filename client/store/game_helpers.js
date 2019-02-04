import axios from 'axios'
import history from '../history'

import firebase from 'firebase'
import database from '../firebase'

const GET_PLAYERS = 'GET_PLAYERS'

const getPlayers = players => ({type: GET_PLAYERS, players})

//vote for players just needs an api call no change to state required?

export const getPlayersThunk = slug => {
  return async dispatch => {
    //make an array here that we can run through
    //we need to pick out the player themselves and anyone listed as dead
    await database.ref(`/rooms/${slug}/players`).once('value', snapshot => {
      dispatch(getPlayers(snapshot.val()))
    })
  }
}

export const voteForPlayerThunk = (slug, uid, player) => {
  return async dispatch => {
    try {
      await axios.put('/api/wolf/vote', {
        slug,
        uid,
        player
      })
    } catch (err) {
      console.error(err)
    }
  }
}
const initialState = {}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PLAYERS:
      return {...state, players: action.players}
    default:
      return state
  }
}

export default reducer
