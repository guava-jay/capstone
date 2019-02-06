import axios from 'axios'
import history from '../history'
import {JOIN_GAME} from './user'

//Action types
export const CREATE_GAME = 'CREATE_GAME'
export const RESET = 'RESET'

//Action creators
const createGame = (slug, gameName) => ({
  type: CREATE_GAME,
  slug,
  gameName
})

const reset = () => ({type: RESET})
//and then join game the role will be player

//thunk creators
export const createNewGame = (uid, game) => async dispatch => {
  const {data: slug} = await axios.post('/api/game', {uid, game})
  history.push(`/newGame/${slug}`)
  dispatch(createGame(slug, game))
}

export const resetThunk = () => dispatch => {
  dispatch(reset())
}

export const endGameThunk = slug => async dispatch => {
  await axios.put(`/api/game/${slug}`, {status: 'finished'})
}

export const startGameThunk = slug => async dispatch => {
  await axios.put(`/api/game/${slug}`, {status: 'playing'})
}

export const deleteGameThunk = slug => async dispatch => {
  await axios.put(`/api/game/remove/${slug}`)
}

export const resetGameThunk = slug => async dispatch => {
  await axios.put(`/api/game/${slug}/replay`)
}

export const checkAnswersThunk = (
  answers,
  currentQuestion,
  slug
) => async dispatch => {
  const {data} = await axios.put(`/api/quiz/score`, {
    answers,
    currentQuestion,
    slug
  })
  //this returns the answer
  return data
}

export const getNewQuestion = (slug, gameName) => async dispatch => {
  let {data} = await axios.put(`/api/${gameName}/changequestion`, {slug})
  // if (data.remainingQuestions === 0) {
  //   await axios.put(`/api/game/${slug}`, {status: 'finished'})
  // }
}

const initialState = {}

//reducer
const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case JOIN_GAME:
      return {...state, slug: action.slug}
    case CREATE_GAME:
      return {...state, slug: action.slug, gameName: action.gameName}
    case RESET:
      return {}
    default:
      return state
  }
}

export default gameReducer
