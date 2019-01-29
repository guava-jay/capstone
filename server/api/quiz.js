const router = require('express').Router()
const database = require('../db/index')
const firebase = require('firebase-admin')
module.exports = router

//fetch a question based on its ID
router.get(`/:qID`, async (req, res, next) => {
  try {
    await database
      .ref(`game_list/quiz/${req.params.qID}/`)
      .once('value')
      .then(snapshot => {
        res.send(snapshot.val())
      })
  } catch (err) {
    console.error(err)
    next()
  }
})

//change the current question
//this one will set it randomly, and return the question ID
//or should it return the question itself?
//maybe both
router.put(`/`, async (req, res, next) => {
  //the touppercase isn't strictly needed but it can't hurt
  const slug = req.body.slug.toUpperCase()
  try {
    //get the number of questions
    let totalNumberOfQuestions = 0
    let newQuestionId = 0
    let newQuestion = {}
    await database
      .ref(`game_list/quiz/`)
      .once('value')
      .then(snapshot => {
        totalNumberOfQuestions = snapshot.numChildren()
        newQuestionId = Math.floor(Math.random() * totalNumberOfQuestions)
        newQuestion = snapshot.child(newQuestionId).val()
      })
    console.log(newQuestion)

    // ref = database.ref(`rooms/${slug}`);
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
