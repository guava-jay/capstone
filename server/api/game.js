const router = require('express').Router()
const database = require('../db/index')
module.exports = router

router.post('/', (req, res, next) => {
  const slug = req.body.slug
  try {
    database
      .ref(`rooms/`)
      .child(slug)
      .set({
        status: 'waiting'
      })
    res.status(201).send(slug)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error creating new game')
  }
})
