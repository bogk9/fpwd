const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const questions = await req.repositories.questionRepo.getQuestions()
    res.json(questions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve questions' })
  }
})

router.get('/:questionId', async (req, res) => {
  const { questionId } = req.params
  try {
    const question = await req.repositories.questionRepo.getQuestionById(
      questionId
    )
    res.json(question)
  } catch (error) {
    res.status(404).json({ error: 'Question not found' })
  }
})

router.post('/', async (req, res) => {
  const { author, summary } = req.body
  const question = { author, summary }
  try {
    const result = await req.repositories.questionRepo.addQuestion(question)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add question' })
  }
})

router.get('/:questionId/answers', async (req, res) => {
  const { questionId } = req.params
  try {
    const answers = await req.repositories.questionRepo.getAnswers(questionId)
    res.json(answers)
  } catch (error) {
    res.status(404).json({ error: 'Question not found' })
  }
})

router.post('/:questionId/answers', async (req, res) => {
  const { questionId } = req.params
  const { author, summary } = req.body
  const answer = { author, summary }
  try {
    const result = await req.repositories.questionRepo.addAnswer(
      questionId,
      answer
    )
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add answer' })
  }
})

router.get('/:questionId/answers/:answerId', async (req, res) => {
  const { questionId, answerId } = req.params
  try {
    const answer = await req.repositories.questionRepo.getAnswer(
      questionId,
      answerId
    )
    res.json(answer)
  } catch (error) {
    res.status(404).json({ error: 'Answer not found' })
  }
})

module.exports = router
