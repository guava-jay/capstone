const router = require('express').Router()
const database = require('../db/index')
module.exports = router

router.post('/', (req, res, next) => {
  try {
    let generateSlug = () => {
      let arr = []
      let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let i = 0; i < 4; i++) {
        const index = Math.floor(36 * Math.random())
        arr.push(chars[index])
      }
      return arr.join('')
    }

    let slug = generateSlug()
    const ref = database.ref(`rooms/`)
    ref.once('value').then(function(snapshot) {
      let alreadyThere = snapshot.hasChild(slug)
      while (alreadyThere) {
        slug = generateSlug()
        alreadyThere = snapshot.hasChild(slug)
      }

      database
        .ref(`rooms/`)
        .child(slug)
        .set({
          status: 'waiting'
        })
      res.status(201).send(slug)
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Error creating new game')
  }
})
