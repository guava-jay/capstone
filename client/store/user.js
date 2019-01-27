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

/**
 * THUNK CREATORS
 */
const database = firebase.database()

// Login thunk
export const setPlayerThunk = uid => {
  return async dispatch => {
    // const data = await firebase.auth().signInAnonymouslyAndRetrieveData()
    // database.ref(`rooms/${room}/players/${data.user.uid}`).set({
    //   name
    // })
    dispatch(setPlayer(uid))
  }
}

// export const me = () => async dispatch => {
//   try {
//     const res = await axios.get('/auth/me')
//     dispatch(getUser(res.data || defaultUser))
//   } catch (err) {
//     console.error(err)
//   }
// }

// export const auth = (email, password, method) => async dispatch => {
//   let res
//   try {
//     res = await axios.post(`/auth/${method}`, {email, password})
//   } catch (authError) {
//     return dispatch(getUser({error: authError}))
//   }

//   try {
//     dispatch(getUser(res.data))
//     history.push('/home')
//   } catch (dispatchOrHistoryErr) {
//     console.error(dispatchOrHistoryErr)
//   }
// }

// export const logout = () => async dispatch => {
//   try {
//     await axios.post('/auth/logout')
//     dispatch(removeUser())
//     history.push('/login')
//   } catch (err) {
//     console.error(err)
//   }
// }

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case CREATE_GAME:
      return {...state, role: 'host'}
    case SET_PLAYER:
      return {...state, uid: action.playeruid}
    default:
      return state
  }
}
