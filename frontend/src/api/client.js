import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const analyzeFiles = (resumeFile, jdFile) => {
  const form = new FormData()
  form.append('resume', resumeFile)
  form.append('jd', jdFile)
  return api.post('/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const generateQuiz = (skill, level) =>
  api.post('/quiz/generate', { skill, level })

export const submitQuiz = (payload) =>
  api.post('/quiz/submit', payload)

export default api
