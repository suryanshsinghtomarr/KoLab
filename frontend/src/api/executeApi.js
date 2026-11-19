import api from './axios'

export const runCode = (payload) => api.post('/execute', payload)
