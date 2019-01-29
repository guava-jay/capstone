const router = require('express').Router()
const database = require('../db/index')
const firebase = require('firebase-admin')
module.exports = router

//fetch a question based on its ID

//fetch a question based on its room ID
router.get(`/rooms/:slug`, async (req, res, next) => {
  try {
    await database.ref(`rooms/${req.params.slug}`).once('value', snapshot => {})
  } catch (err) {
    console.error(err)
    next()
  }
})

router.get(`/:qID`, async (req, res, next) => {
  try {
    await database
      .ref(`game_list/quiz/${req.params.qID}/`)
      .once('value', snapshot => {
        res.send(snapshot.val())
      })
  } catch (err) {
    console.error(err)
    next()
  }
})

//change the current question
//this one will set it randomly, and return the question ID

//

router.put(`/changequestion`, async (req, res, next) => {
  //the touppercase isn't strictly needed but it can't hurt
  const slug = req.body.slug.toUpperCase()

  try {
    let totalNumberOfQuestions = 0
    let newQuestionId = 0
    let newQuestion = {}
    //add array and num remaining

    //first pull the array of answered questions from the room
    let answeredQuestions = []
    await database.ref(`rooms/${slug}`).once('value', snapshot => {
      if (!snapshot.val()) {
        console.log('next is supposed to end the request....')
        next('Error: Room not found')
      }
      if (snapshot.child('status').val() !== 'playing')
        console.error(`Game status is ${snapshot.child('status').val()}`)
      answeredQuestions = snapshot.child('answered_questions')
    })

    //then do a math.random and check if its in the array
    //if yes reroll until you get something new
    //probably a better way to do that.... compare sets and get new set of values in b not in a. i imagine thats possible

    await database.ref(`game_list/quiz/`).once('value', snapshot => {
      if (!snapshot.val()) console.error('Could not find question list')
      totalNumberOfQuestions = snapshot.numChildren()
      newQuestionId = Math.floor(Math.random() * totalNumberOfQuestions)
      newQuestion = snapshot.child(newQuestionId).val()
      if (!newQuestion)
        console.error(`Selected question ${newQuestionId} is not valid`)
    })
    console.log(newQuestion)

    await database
      .ref(`rooms/${slug}/`)
      .child('current_question')
      .set(newQuestionId)

    res.status(201).send(newQuestion)
  } catch (err) {
    console.error(err)
    next()
  }
})

//route for player submitting their answer to /quiz/answer
//expects the request body to contain player uID, slug and answer
router.put('/answer', async (req, res, next) => {
  const slug = req.body.slug.toUpperCase()
  try {
    //check that it's all valid
    //ah hell what was i doing. i need to... get the current question id from the room. yeah
    let currentQuestion = 0
    await database.ref(`rooms/${slug}/`).once('value', snapshot => {
      if (!snapshot.val()) throw new Error(`Could not find room ${slug}`)
      if (!snapshot.child(req.body.uid))
        throw new Error(`Could not find user ${req.body.uid}`)
      currentQuestion = snapshot.child('current_question').val()
    })
    //now add their response
    await database.ref(`rooms/${slug}/${req.body.uid}/`)
  } catch (err) {
    console.error(err)
    next()
  }
})
