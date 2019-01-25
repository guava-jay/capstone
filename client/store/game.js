import axios from 'axios'
import history from '../history'

//Action types
const CREATE_GAME = 'CREATE_GAME'
const DELETE_GAME = 'DELETE_GAME'

//Action creators
const createGame = slug => ({
  type: CREATE_GAME,
  slug
})

//thunk creators
export const createNewGame = slug => async dispatch => {
  console.log('in thunk createNewGame')
  const {data: game} = await axios.post('/api/game', slug)
  dispatch(createGame(game))
}

const initialState = {}

//reducer
const gameReducer = (state = initialState, action) => {
  console.log('in reducer')
  switch (action.type) {
    case CREATE_GAME:
      return {...state, game: action.slug}
    default:
      return state
  }
}

export default gameReducer
