const {expect} = require('chai')
const request = require('supertest')
const app = require('../index')

describe('quiz api routes', () => {
  describe('GET api/quiz/:qID', () => {
    it('fetches the specified quiz object', async () => {
      await request(app)
        .get('/api/quiz/:qID')
        .send({qID: 0})
        .expect(200)
    })
  })
})
