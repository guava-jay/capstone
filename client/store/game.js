import axios from 'axios'
import history from '../history'
import {JOIN_GAME} from './user'

//Action types
export const CREATE_GAME = 'CREATE_GAME'
const DELETE_GAME = 'DELETE_GAME'

//Action creators
const createGame = slug => ({
  type: CREATE_GAME,
  slug
})
//and then join game the role will be player

//thunk creators
export const createNewGame = uid => async dispatch => {
  const {data: slug} = await axios.post('/api/game', {uid})
  history.push(`/newGame/${slug}`)
  dispatch(createGame(slug))
}

const initialState = {}

//reducer
const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case JOIN_GAME:
      return {...state, slug: action.slug}
    case CREATE_GAME:
      return {...state, slug: action.slug}
    default:
      return state
  }
}

export default gameReducer
