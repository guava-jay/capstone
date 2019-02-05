/* eslint-disable complexity */
const router = require('express').Router()
const database = require('../db/index')
module.exports = router

//expects slug, uid (who did the voting), playerId(id of who was voted for)
router.put('/vote', async (req, res, next) => {
  const slug = req.body.slug.toUpperCase()
  //get the current day/cycle
  //check player's role; are they a wolf?
  //add to votes under player

  try {
    //check that it's all valid
    let currentCycle = ''
    let currentDay = 0
    let userRole = ''
    await database.ref(`rooms/${slug}/`).once('value', snapshot => {
      //if the room is invalid we're done
      if (!snapshot.val()) next(`Could not find room ${slug}`)
      //if the user is invalid we're done
      if (!snapshot.child(`players/${req.body.uid}`))
        next(`Could not find user ${req.body.uid}`)
      //otherwise we want to get the current day from the room
      //and the role of the user
      currentCycle = snapshot.child('active_game/cycle').val()
      currentDay = snapshot.child('active_game/day').val()
      userRole = snapshot.child(`players/${req.body.uid}/role`).val()
    })
    //make sure they're allowed to vote right now
    if (
      currentCycle === 'dayDiscussion' ||
      currentCycle === 'seer' ||
      (currentCycle === 'wolfVote' && userRole !== 'wolf')
    ) {
      next('User cannot vote at this time')
    }

    // now add their response
    await database
      .ref(`rooms/${slug}/players/${req.body.uid}/`)
      .child('lastVote')
      .set(req.body.playerId)

    await database
      .ref(`rooms/${slug}/active_game/votes/${currentDay}/${req.body.uid}`)
      .set(req.body.answer)

    res.send('done')
  } catch (err) {
    console.error(err)
    next(err)
  }
})

//tally up votes from last round and kill the correct player
//expects the slug
router.get('/tally', async (req, res, next) => {
  //first get the number for last round
  //then add up each vote under votes/round
  let currentCycle = ''
  let currentDay = 0
  let votes = {}
  const slug = req.body.slug.toUpperCase()
  await database.ref(`/rooms/${slug}/active_game`).once('value', snapshot => {
    currentCycle = snapshot.child('cycle').val()
    currentDay = snapshot.child('day').val()
    votes = snapshot.child(`/votes/${currentDay}`).val()
  })
  res.send(votes)
})
