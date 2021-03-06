/* eslint-disable guard-for-in */
/* eslint-disable complexity */
const router = require('express').Router()
const database = require('../db/index')
module.exports = router

//constants to make sure every path is handled correctly.
//if we change the db structure later this makes it easier to change
const ACTIVE_GAME = 'active_game'
const ANSWERED_QUESTIONS = 'active_game/answered_question'
const CURRENT_QUESTION = 'active_game/current_question'

//helper function to get number of questions in quiz
let totalNumberOfQuestions = async () => {
  let result = 0
  try {
    await database.ref(`game_list/quiz/`).once('value', snapshot => {
      if (!snapshot.val()) console.error('Could not find question list')
      result = snapshot.numChildren()
    })
  } catch (err) {
    console.error(err)
  }
  return result
}

//checks submitted answers and scores them back to player in firebase
router.put('/score', async (req, res, next) => {
  //grab the answer from db and check it then set play scores back

  try {
    const answer = database.ref(
      `/game_list/quiz/${req.body.currentQuestion}/answer`
    )
    let answerValue
    await answer.once('value', snapshot => {
      answerValue = snapshot.val()

      for (let key in req.body.answers) {
        const PLAYER = `/rooms/${req.body.slug}/players/${key}`

        if (req.body.answers[key] == answerValue) {
          let currentScore = database.ref(`${PLAYER}/currentScore`)

          currentScore.once('value', snapshot => {
            let newScore = snapshot.val() + 1
            currentScore.set(newScore)
          })

          database
            .ref(`${PLAYER}/answers/${req.body.currentQuestion}/correct`)
            .set(true)
        } else {
          database
            .ref(`${PLAYER}/answers/${req.body.currentQuestion}/correct`)
            .set(false)
        }
      }
    })
    res.json(answerValue)
  } catch (err) {
    next(err)
  }
})

//fetch a question based on its ID
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
//this one will set it randomly, and return the number of questions remaining
//it expects slug for the current room
router.put(`/changequestion`, async (req, res, next) => {
  //the touppercase isn't strictly needed but it can't hurt
  const slug = req.body.slug.toUpperCase()
  try {
    let numQuestions = await totalNumberOfQuestions()
    let currentQuestionId = null
    let newQuestionId = 0
    //add array and num remaining

    await database
      .ref(`/rooms/${req.body.slug}/active_game/current_answers/`)
      .set(null)

    //first pull the array of answered questions from the room
    let answeredQuestions = []
    await database.ref(`rooms/${slug}`).once('value', snapshot => {
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
    await database.ref(`/rooms/${slug}/${CURRENT_QUESTION}/`).set(newQuestionId)

    //this is just a little fix for if the game has just started
    if (!answeredQuestions.length) answeredQuestions = 'none'

    //append answered questions
    await database
      .ref(`rooms/${slug}/${ANSWERED_QUESTIONS}`)
      .set(answeredQuestions)

    res.status(201).end()
  } catch (err) {
    console.error(err)
    next(err)
  }
})
//route for player submitting their answer to /quiz/answer
//expects the request body to contain player uid, slug and answer
router.put('/answer', async (req, res, next) => {
  const slug = req.body.slug.toUpperCase()
  try {
    //check that it's all valid
    let currentQuestion = 0
    await database.ref(`rooms/${slug}/`).once('value', snapshot => {
      //if the room is invalid we're done
      if (!snapshot.val()) next(`Could not find room ${slug}`)
      //if the user is invalid we're done
      if (!snapshot.child(`players/${req.body.uid}`))
        next(`Could not find user ${req.body.uid}`)
      //get the question ID for the room
      currentQuestion = snapshot.child(CURRENT_QUESTION).val()
    })

    // now add their response
    await database
      .ref(`rooms/${slug}/players/${req.body.uid}/`)
      .child('answers')
      .child(currentQuestion)
      .child('choice')
      .set(req.body.answer)

    await database
      .ref(`rooms/${slug}/active_game/current_answers/${req.body.uid}`)
      .set(req.body.answer)

    res.send('done')
  } catch (err) {
    console.error(err)
    next(err)
  }
})
