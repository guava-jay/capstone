/* eslint-disable camelcase */
const router = require('express').Router()
const database = require('../db/index')
module.exports = router

//slug generator
let generateSlug = () => {
  let arr = []
  let chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  for (let i = 0; i < 4; i++) {
    const index = Math.floor(chars.length * Math.random())
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
            game_name: req.body.game,
            current_question: null
          }
        })
        .then(() => {
          res.status(201).json(slug)
        })
    })
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

router.put('/remove', async (req, res, next) => {
  const slug = req.body.slug.toUpperCase()
  try {
    const ref = database.ref(`rooms/${slug}/players/${req.body.uid}`)
    await ref.remove()
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    next()
  }
})

router.put('/remove/:slug', async (req, res, next) => {
  try {
    const ref = database.ref(`rooms/${req.params.slug}`)
    await ref.remove()
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    next()
  }
})

//toggle game room to playing
router.put('/:slug/replay', (req, res, next) => {
  try {
    database
      .ref(`/rooms/${req.params.slug}/active_game/answered_question`)
      .set({answered_question: []})
    database
      .ref(`/rooms/${req.params.slug}/players`)
      .once('value')
      .then(snapshot => {
        snapshot.forEach(childSnap => {
          const name = childSnap.child('displayName').val()
          database
            .ref(`/rooms/${req.params.slug}/players/${childSnap.key}`)
            .set({currentScore: 0, answers: null, displayName: name})
        })
      })
    res.end()
  } catch (err) {
    next(err)
  }
})

//toggle game room to playing
router.put('/:slug', (req, res, next) => {
  try {
    database.ref(`/rooms/${req.params.slug}/`).update({status: req.body.status})
    res.end()
  } catch (err) {
    next(err)
  }
})
