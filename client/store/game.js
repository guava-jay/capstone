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
export const createNewGame = () => async dispatch => {
  console.log('in create new game thunk')
  const {data: slug} = await axios.post('/api/game')
  dispatch(createGame(slug))
}

const initialState = {}

//reducer
const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GAME:
      return {...state, slug: action.slug}
    default:
      return state
  }
}

export default gameReducer
