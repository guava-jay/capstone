import axios from 'axios'
import history from '../history'
import firebase from '../firebase'
import {CREATE_GAME} from './game'

/**
 * ACTION TYPES
 */
// const GET_USER = 'GET_USER'
// const REMOVE_USER = 'REMOVE_USER'
const SET_PLAYER = 'SET_PLAYER'
const JOIN_GAME = 'JOIN_GAME'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
// const getUser = user => ({type: GET_USER, user})
// const removeUser = () => ({type: REMOVE_USER})
const setPlayer = playeruid => ({type: SET_PLAYER, playeruid})
const joinGame = role => ({type: JOIN_GAME, role})

/**
 * THUNK CREATORS
 */
const database = firebase.database()

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

export const joinGameThunk = (slug, uid, displayName) => {
  return async dispatch => {
    try {
      await axios.post('/api/game/join', {
        slug,
        uid,
        displayName
      })
      history.push(`/newGame/${slug}`)
      dispatch(joinGame('player'))
    } catch (error) {
      console.error(error)
    }
  }
}

/**
 * REDUCER
 */
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
