const { readFile, writeFile } = require('fs/promises')
const { v4: uuidv4 } = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()
    const question = questions.find(q => q.id === questionId)
    if (!question) {
      throw new Error('Question not found')
    }
    return question
  }

  const addQuestion = async question => {
    const questions = await getQuestions()
    const newQuestion = { ...question, id: uuidv4(), answers: [] }
    questions.push(newQuestion)
    await writeFile(fileName, JSON.stringify(questions))
    return newQuestion
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)
    return question.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const question = await getQuestionById(questionId)
    const answers = question.answers
    const answer = answers.find(a => a.id === answerId)
    if (!answer) {
      throw new Error('Answer not found')
    }
    return answer
  }

  const addAnswer = async (questionId, answer) => {
    const questions = await getQuestions()
    const questionIndex = questions.findIndex(
      question => question.id === questionId
    )
    if (questionIndex === -1) {
      throw new Error('Question not found')
    }
    const updatedQuestions = [...questions]
    const newAnswer = { ...answer, id: uuidv4() }
    updatedQuestions[questionIndex].answers.push(newAnswer)
    await writeFile(fileName, JSON.stringify(updatedQuestions))
    return newAnswer
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
