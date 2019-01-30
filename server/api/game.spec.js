const {expect} = require('chai')
const request = require('supertest')
const app = require('../index')

const admin = require('firebase-admin')
if (process.env.NODE_ENV !== 'production') require('../../secrets')
// Initialize database with global variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.project_id,
    clientEmail: process.env.client_email,
    privateKey: process.env.private_key.replace(/\\n/g, '\n')
  }),
  databaseURL: 'https://guava-stackbox.firebaseio.com'
})
// Back-end firebase is admin.database()
const database = admin.database()

describe('game api routes', () => {
  describe('GET api/game', () => {
    it('returns helloworld', async () => {
      const res = await request(app)
        .get('/api/game')
        .expect(200)
      expect(res.body).to.equal('helloworld')
    })

    it('generates a game room code, can add users with a valid code', async () => {
      const res = await request(app)
        .post('/api/game')
        .send({uid: 'uid'})
        .expect(201)
      expect(res.body).to.have.lengthOf(4)
      let slug = res.body
      console.log(slug)
      describe('/api/game/join', () => {
        it('can add users with a valid code', async () => {
          await request(app)
            .post('/api/game/join')
            .send({slug: slug, uid: 'uid', displayName: 'displayName'})
            .expect(201)
          await database.ref(`/rooms/${slug}`).remove()
        })
        it('errors on users with an invalid code', async () => {
          await request(app)
            .post('/api/game/join')
            .send({slug: '????', uid: 'uid', displayName: 'displayName'})
            .expect(404)
        })
      })
    })
  })
})
