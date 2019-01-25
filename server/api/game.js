const router = require('express').Router()
const database = require('../db/index')
module.exports = router

router.post('/', (req, res, next) => {
  const ref = database.ref('users/').set({
    bob: 'hi',
    john: 'hey',
    tom: 'hello',
    daniel: 'heya'
  })

  // Read from the front end

  database
    .ref('users')
    .once('value')
    .then(function(snapshot) {
      res.send(snapshot.val())
    })
})
