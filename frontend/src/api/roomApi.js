import api from './axios'
export const createRoom = (data = {}) => api.post('/rooms', data)
export const joinRoom = (roomId) => api.post(`/rooms/${roomId}/join`)
export const getRoom = (roomId) => api.get(`/rooms/${roomId}`)
export const getMyRooms = () => api.get('/rooms/mine')
export const deleteRoom = (roomId) => api.delete(`/rooms/${roomId}`)
