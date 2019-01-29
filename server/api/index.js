const router = require('express').Router()
module.exports = router

router.use('/game', require('./game'))
router.use('/quiz', require('./quiz'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
