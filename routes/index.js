const express = require('express')
const questionsRoutes = require('./questions')

const router = express.Router()

router.use('/questions', questionsRoutes)

module.exports = router
