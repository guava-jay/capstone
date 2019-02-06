const router = require('express').Router()
const database = require('../db/index')
module.exports = router

//not going to bother with a randomizer this time. no time right now. there are 50 qs for mostlikely to
//just needs slug
router.put('/changequestion', async (req, res, next) => {
  let currentQuestion = ''
  const questionref = database.ref(
    `/rooms/${req.body.slug}/active_game/current_question`
  )
  await questionref.once('value', snapshot => {
    currentQuestion = snapshot.val()
  })

  await database
    .ref(`/rooms/${req.body.slug}/active_game/current_answers/`)
    .set(null)

  if (currentQuestion >= 52) {
    res.status(201).send({remainingQuestions: 0})
  } else {
    questionref.set(currentQuestion + 1)
    res.status(201).send({remainingQuestions: 52 - currentQuestion})
  }
})

//expects slug, userid, playerid
router.put('/vote', async (req, res, next) => {
  const slug = req.body.slug.toUpperCase()
  const uId = req.body.uId
  const playerId = req.body.playerId
  const currentQuestion = req.body.currentQuestion
  try {
    //get the current question
    //now add their vote. votes are added onto the player under votes/question number
    await database
      .ref(`rooms/${slug}/players/${playerId}/votes`)
      .child(currentQuestion)
      .child(uId)
      .set(true)

    //also add their vote to the current answers part because that's what the host is watching to determine everyone has answered

    await database
      .ref(`/rooms/${slug}/active_game/current_answers/${uId}`)
      .set(playerId)
    res.send('done')
  } catch (err) {
    next(err)
  }
})
