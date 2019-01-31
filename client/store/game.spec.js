// import { expect } from 'chai'
// import gameReducer, { CREATE_GAME, createNewGame } from './game'
// import axios from 'axios'
// import MockAdapter from 'axios-mock-adapter'
// import configureMockStore from 'redux-mock-store'
// import thunkMiddleware from 'redux-thunk'
// import history from '../history'

// const middlewares = [thunkMiddleware]
// const mockStore = configureMockStore(middlewares)

// describe('Game reducer', () => {
//   let store
//   let mockAxios
//   const initialState = { game: {} }

//   beforeEach(() => {
//     mockAxios = new MockAdapter(axios)
//     store = mockStore(initialState)
//   })

//   afterEach(() => {
//     mockAxios.restore()
//     store.clearActions()
//   })

//   describe('initial state', () => {
//     it('should return the initial state', () => {
//       expect(gameReducer(undefined, {})).to.deep.equal({})
//     })

//     // slug returns 4 letters
//     it('should return 4 letters for slugs', async () => {
//       mockAxios.onPost('/api/game').replyOnce(201, 'SLUG')
//       await store.dispatch(createNewGame('someuid'))
//       const actions = store.getActions()
//       expect(actions[0].slug).to.have.length(4)
//     })
//   })
// })
