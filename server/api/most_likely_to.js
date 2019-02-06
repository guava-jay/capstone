const router = require('express').Router()
const database = require('../db/index')
module.exports = router

// get total questin
let totalNumberOfQuestions = async () => {
  let result = 0
  try {
    await database
      .ref(`game_list/most_likely_to/questions/`)
      .once('value', snapshot => {
        if (!snapshot.val()) console.error('Could not find question list')
        result = snapshot.val().length
      })
  } catch (err) {
    console.error(err)
  }
  return result
}

//not going to bother with a randomizer this time. no time right now. there are 50 qs for mostlikely to
//just needs slug
router.put('/changequestion', async (req, res, next) => {
  try {
    const ANSWERED_QUESTIONS = 'active_game/answered_question'
    const CURRENT_QUESTION = 'active_game/current_question'
    let numQuestions = await totalNumberOfQuestions()
    let currentQuestionId = null
    let newQuestionId = 0

    // const questionref = database.ref(
    //   `/rooms/${req.body.slug}/active_game/current_question`
    // )

    await database
      .ref(`/rooms/${req.body.slug}/active_game/current_answers/`)
      .set(null)

    let answeredQuestions = []
    await database.ref(`rooms/${req.body.slug}`).once('value', snapshot => {
      //if the room doesn't exist exit with error
      if (!snapshot.val()) {
        res.status(404).send('Error: Room not found')
        return
      }
      answeredQuestions = snapshot.child(`${ANSWERED_QUESTIONS}/`).val()
      currentQuestionId = snapshot.child(`${CURRENT_QUESTION}/`).val()
    })

    //check if answeredquestions is null (meaning this function has never been called, so the game is starting)
    if (!answeredQuestions) {
      answeredQuestions = []
    } else if (answeredQuestions === 'none') {
      //check if answeredquestions is 'none' (meaning this function has been called ONCE, so the first question has just been answered)
      answeredQuestions = [currentQuestionId]
    } else if (typeof answeredQuestions === 'number') {
      //if answeredquestions contains only one value convert it into an array (so we can do array fns)
      answeredQuestions = [answeredQuestions]
    } else {
      // else if (answeredQuestions.length === numQuestions - 1) {
      //   //if we have answered all the questions we don't need to do anything else. just return 0 remaining
      //   res.send({ remainingQuestions: 0 })
      //otherwise, we have 2 or more questions answered. add the current question to the answered array.
      answeredQuestions.push(currentQuestionId)
    }

    //now make an array of all the unanswered questions
    const unansweredQuestions = []
    for (let i = 0; i < numQuestions; i++) {
      if (!answeredQuestions.includes(i)) {
        unansweredQuestions.push(i)
      }
    }
    //now pick an unanswered question from this array
    newQuestionId =
      unansweredQuestions[
        Math.floor(Math.random() * unansweredQuestions.length)
      ]
    //set the new question id to equal the randomly chosen question
    await database
      .ref(`/rooms/${req.body.slug}/${CURRENT_QUESTION}/`)
      .set(newQuestionId)

    //this is just a little fix for if the game has just started
    if (!answeredQuestions.length) answeredQuestions = 'none'

    //append answered questions
    await database
      .ref(`rooms/${req.body.slug}/${ANSWERED_QUESTIONS}`)
      .set(answeredQuestions)

    res.status(201).end()
  } catch (err) {
    next(err)
  }
  // let currentQuestion = ''
  // const questionref = database.ref(
  //   `/rooms/${req.body.slug}/active_game/current_question`
  // )
  // await questionref.once('value', snapshot => {
  //   currentQuestion = snapshot.val()
  // })

  // await database
  //   .ref(`/rooms/${req.body.slug}/active_game/current_answers/`)
  //   .set(null)

  // if (currentQuestion >= 52) {
  //   res.status(201).send({ remainingQuestions: 0 })
  // } else {
  //   questionref.set(currentQuestion + 1)
  //   res.status(201).send({ remainingQuestions: 52 - currentQuestion })
  // }
})

//expects slug, userid, playerid
router.put('/vote', async (req, res, next) => {
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

    //also add their vote to the current answers part because that's what the host is watching to determine everyone has answered

    await database
      .ref(`/rooms/${slug}/active_game/current_answers/${uId}`)
      .set(playerId)
    res.send('done')
  } catch (err) {
    next(err)
  }
})
