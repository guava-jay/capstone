const {expect} = require('chai')
const request = require('supertest')
const app = require('../index')

describe('quiz api routes', () => {
  describe('GET api/quiz/rooms/:slug', () => {
    it('fetches the specified room', async () => {
      const {body: slug} = await request(app)
        .post('/api/game')
        .send({uid: 'uid'})
      console.log(slug)
      await request(app)
        .get(`api/quiz/rooms/${slug}`) //${slug}
        .expect(200)
    })
  })
  describe('GET api/quiz/:qID', () => {
    it('fetches the specified quiz object', async () => {
      await request(app)
        .get('/api/quiz/:qID')
        .send({qID: 0})
        .expect(200)
    })
  })
})
