const {expect} = require('chai')
const request = require('supertest')
const app = require('../index')

describe('game api routes', () => {
  describe('GET api/game', () => {
    it('returns helloworld', async () => {
      const res = await request(app)
        .get('/api/game')
        .expect(200)
      expect(res.body).to.equal('helloworld')
    })

    it('can run more than one test', async () => {
      const res = await request(app)
        .get('/api/game')
        .expect(200)
      expect(res.body).to.equal('helloworld')
    })
  })
})
