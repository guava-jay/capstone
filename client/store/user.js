import axios from 'axios'
import history from '../history'
import firebase from 'firebase'
import database from '../firebase'
import {CREATE_GAME, RESET} from './game'

//ACTION TYPES
const SET_PLAYER = 'SET_PLAYER'
export const JOIN_GAME = 'JOIN_GAME'
// const DELETE_PLAYER = 'DELETE_PLAYER'
const ERROR_OUT = 'ERROR_OUT'

const MAX_PLAYERS = 4

//INITIAL STATE
const defaultUser = {}

//ACTION CREATORS
const setPlayer = playeruid => ({type: SET_PLAYER, playeruid})
const joinGame = (slug, role) => ({type: JOIN_GAME, slug, role})
const errorOut = errorMsg => ({type: ERROR_OUT, errorMsg})
//const deletePlayer = playeruid => ({ type: DELETE_PLAYER.playeruid })

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
    let gameExists = false
    let gameFull = false
    let gameWaiting = false

    //query DB for game
    let gameRef = database.ref(`/rooms/${slug}`)
    await gameRef.once(
      'value',
      gameSnap => {
        if (gameSnap.val()) {
          //if game/slug exists
          gameExists = true
          if (gameSnap.child('status').val() === 'waiting') {
            gameWaiting = true
          }
        }
      },
      errorObject => {
        console.log('The read failed:', errorObject.code)
      }
    )
    //query DB for players in game
    if (gameExists && gameWaiting) {
      //if the game exists, check if full
      let playersRef = database.ref(`/rooms/${slug}/players`)
      await playersRef.once(
        'value',
        playerSnap => {
          if (playerSnap.val()) {
            //if more than 0 players
            let playerKeys = Object.keys(playerSnap.val())
            if (playerKeys.length >= MAX_PLAYERS) {
              //check length; if full...
              gameFull = true //...set gameFull to true
            }
          }
        },
        errorObject => {
          console.log('The read failed:', errorObject.code)
        }
      )
    }

    if (gameExists) {
      //if game exists
      if (gameFull) {
        //if full
        dispatch(errorOut('Error: game is full'))
        return
      } else if (!gameWaiting) {
        dispatch(errorOut('Error: Game is not awaiting new players'))
        return
      }
    } else {
      //if game doesn't exist
      dispatch(
        errorOut('Error: Game not found. Please check your entered code.')
      ) //return error message
      return
    }

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

export const deletePlayerThunk = (slug, uid) => {
  return async dispatch => {
    try {
      await axios.put('/api/game/remove', {slug, uid})
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
    case ERROR_OUT:
      return {...state, errorMsg: action.errorMsg}
    case RESET:
      return {...state, role: null}
    default:
      return state
  }
}
