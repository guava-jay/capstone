const router = require('express').Router()
const database = require('../db/index')
module.exports = router

//expects slug, userid, playerid
router.put('/vote', async (req, res, next) => {
  console.log(req.body)
  const slug = req.body.slug.toUpperCase()
  const uId = req.body.uId
  const playerId = req.body.playerId
  try {
    //get the current question
    let currentQuestion = 0
    await database.ref(`/rooms/${slug}/`).once('value', snapshot => {
      if (!snapshot) {
        next('Could not find room')
      }
      currentQuestion = snapshot.child('/active_game/current_question').val()
    })
    //now add their vote. votes are added onto the player under votes/question number
    await database
      .ref(`rooms/${slug}/players/${playerId}/votes`)
      .child(currentQuestion)
      .child(uId)
      .set(true)

    res.send('done')
  } catch (err) {
    next(err)
  }
})
