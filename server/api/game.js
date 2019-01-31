const router = require('express').Router()
const database = require('../db/index')
const firebase = require('firebase-admin')
module.exports = router

//slug generator
let generateSlug = () => {
  let arr = []
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < 4; i++) {
    const index = Math.floor(36 * Math.random())
    arr.push(chars[index])
  }
  return arr.join('')
}

//testing we can delete later once testing is more efficient
router.get('/', (req, res, next) => {
  try {
    res.json('helloworld')
  } catch (error) {
    next(error)
  }
})

//create a game room and set this device as host
router.post('/', async (req, res, next) => {
  try {
    // move this into generateUniqueSlug
    let slug = generateSlug()
    const ref = database.ref(`rooms/`)
    await ref.once('value').then(function(snapshot) {
      let alreadyThere = snapshot.hasChild(slug)
      while (alreadyThere) {
        slug = generateSlug()
        alreadyThere = snapshot.hasChild(slug)
      }
      // ----

      database
        .ref(`rooms/`)
        .child(slug)
        .set({
          status: 'waiting',
          host: req.body.uid,
          active_game: {
            game_name: 'quiz',
            current_question: null
          }
        })
    })
    res.status(201).json(slug)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error creating new game')
  }
})

//player joining a game
router.post('/join', async (req, res, next) => {
  try {
    //check if room exists
    const slug = req.body.slug.toUpperCase()
    const ref = database.ref(`rooms/`)
    await ref.once('value').then(function(snapshot) {
      let roomExist = snapshot.hasChild(slug)
      if (roomExist) {
        ref
          .child(slug)
          .child('players')
          .child(req.body.uid)
          .set({
            displayName: req.body.displayName,
            currentScore: 0
          })
        res.status(200).end()
      } else {
        next()
      }
    })
  } catch (err) {
    console.error(err)
    next()
  }
})

//toggle game room to playing
router.put('/:slug', (req, res, next) => {
  try {
    database.ref(`/rooms/${req.params.slug}/`).update({status: 'playing'})
    res.end()
  } catch (err) {
    next(err)
  }
})
