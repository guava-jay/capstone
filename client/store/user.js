import axios from 'axios'
import history from '../history'
import firebase from '../firebase'

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
const setPlayer = player => ({type: SET_PLAYER, player})

/**
 * THUNK CREATORS
 */
const database = firebase.database()

// Login thunk
export const setPlayerThunk = () => {
  return async dispatch => {
    // dispatch(startAuthorizing());

    const data = await firebase.auth().signInAnonymouslyAndRetrieveData()
    console.log(data.user.uid)
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
    default:
      return state
  }
}
