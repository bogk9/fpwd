const { writeFile, rm } = require('fs/promises')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: 'question-1',
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: 'question-2',
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return a specific question by ID', async () => {
    const testQuestions = [
      {
        id: 'question-1',
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: 'question-2',
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const question = await questionRepo.getQuestionById('question-1')

    expect(question).toEqual({
      id: 'question-1',
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    })
  })

  test('should throw an error when getting a non-existent question by ID', async () => {
    const testQuestions = [
      {
        id: 'question-1',
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    await expect(
      questionRepo.getQuestionById('non-existent-id')
    ).rejects.toThrow('Question not found')
  })

  test('should throw an error when getting a non-existent answer by ID', async () => {
    const testQuestions = [
      {
        id: 'question-1',
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: 'answer-1',
            text: 'Your name is Jack London.'
          }
        ]
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    await expect(
      questionRepo.getAnswer('question-1', 'non-existent-answer-id')
    ).rejects.toThrow('Answer not found')
  })

  test('should throw an error when getting answers for a non-existent question by ID', async () => {
    const testQuestions = [
      {
        id: 'question-1',
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    await expect(questionRepo.getAnswers('non-existent-id')).rejects.toThrow(
      'Question not found'
    )
  })

  test('should add a question', async () => {
    const question = {
      summary: 'What is your favorite color?',
      author: 'Alice',
      answers: []
    }

    await questionRepo.addQuestion(question)

    const questions = await questionRepo.getQuestions()
    const lastQuestion = questions[questions.length - 1]

    expect(question.summary).toEqual(lastQuestion.summary)
    expect(question.author).toEqual(lastQuestion.author)
    expect(question.answers).toEqual(lastQuestion.answers)
  })

  test('should add an answer to a question', async () => {
    const testQuestion = {
      id: 'question-1',
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([testQuestion]))

    const answer = {
      text: 'Your name is Jack London.'
    }

    await questionRepo.addAnswer('question-1', answer)
    const question = await questionRepo.getQuestionById('question-1')
    expect(question.answers[0].text).toEqual(answer.text)
  })

  test('should not add an answer when no question with that ID is found', async () => {
    const testQuestion = {
      id: 'question-1',
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([testQuestion]))

    const answer = {
      id: 'answer-1',
      text: 'Your name is Jack London.'
    }

    await expect(
      questionRepo.addAnswer('non-existent-id', answer)
    ).rejects.toThrow('Question not found')
  })
})
