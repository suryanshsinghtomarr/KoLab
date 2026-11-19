import api from './axios'

export const saveSession = (session) => api.post('/sessions', session)
export const getMySessions = () => api.get('/sessions')
export const getSession = (sessionId) => api.get(`/sessions/${sessionId}`)
export const deleteSession = (sessionId) => api.delete(`/sessions/${sessionId}`)
