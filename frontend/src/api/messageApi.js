import api from './axios'

export const getRoomMessages = (roomId) => api.get(`/rooms/${roomId}/messages`)
