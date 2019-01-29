const {expect} = require('chai')
const request = require('supertest')
// const db = require('../db')
const app = require('../index')
// const Item = db.model('item')

describe('game api routes', () => {
  describe('GET api/game', async () => {
    const res = await app.get('/api/game').expect(200)
    console.log(res, 'res from testing')
    // expect(res.body).to.be.equal('helloworld')
  })
})
