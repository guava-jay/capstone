import axios from 'axios'
import history from '../history'
import firebase from '../firebase'
import {CREATE_GAME} from './game'

//ACTION TYPES
const SET_PLAYER = 'SET_PLAYER'
export const JOIN_GAME = 'JOIN_GAME'

//INITIAL STATE
const defaultUser = {}

//ACTION CREATORS
const setPlayer = playeruid => ({type: SET_PLAYER, playeruid})
const joinGame = (slug, role) => ({type: JOIN_GAME, slug, role})

//THUNK CREATORS
// Login thunk
export const setPlayerThunk = () => {
  return async dispatch => {
    const {user} = await firebase
      .auth()
      .signInAnonymously()
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // ...
      })
    dispatch(setPlayer(user.uid))
  }
}
// Join thunk
export const joinGameThunk = (slug, uid, displayName) => {
  return async dispatch => {
    slug = slug.toUpperCase()
    try {
      await axios.post('/api/game/join', {
        slug,
        uid,
        displayName
      })
      history.push(`/newGame/${slug}`)
      dispatch(joinGame(slug, 'player'))
    } catch (error) {
      console.error(error)
    }
  }
}

export const setResponseThunk = (slug, uid, answer) => {
  return async dispatch => {
    try {
      await axios.put('/api/quiz/answer', {
        slug,
        uid,
        answer
      })
    } catch (error) {
      console.error(error)
    }
  }
}

//REDUCER
export default function(state = defaultUser, action) {
  switch (action.type) {
    case JOIN_GAME:
      return {...state, role: action.role}
    case CREATE_GAME:
      return {...state, role: 'host'}
    case SET_PLAYER:
      return {...state, uid: action.playeruid}
    default:
      return state
  }
}
