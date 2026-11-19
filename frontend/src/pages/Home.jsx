import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as roomApi from '../api/roomApi'

export default function Home() {
  const [roomId, setRoomId] = useState(''); const [rooms, setRooms] = useState([]); const [error, setError] = useState(''); const navigate = useNavigate()
  useEffect(() => { roomApi.getMyRooms().then(({ data }) => setRooms(data.rooms)).catch(() => setError('Could not load your rooms')) }, [])
  const removeRoom = async (event, roomId) => {
    event.stopPropagation()
    try { await roomApi.deleteRoom(roomId); setRooms((current) => current.filter((room) => room.roomId !== roomId)) } catch (err) { setError(err.response?.data?.message || 'Could not delete room') }
  }
  const create = async () => { try { const { data } = await roomApi.createRoom(); navigate(`/rooms/${data.room.roomId}`) } catch { setError('Could not create room') } }
  const join = async (e) => { e.preventDefault(); if (!roomId.trim()) return; try { await roomApi.joinRoom(roomId.trim().toUpperCase()); navigate(`/rooms/${roomId.trim().toUpperCase()}`) } catch (err) { setError(err.response?.data?.message || 'Room not found') } }
  return <main className="page"><section className="hero-copy"><p className="eyebrow">COLLABORATE IN REAL TIME</p><h1>Your ideas,<br /><em>in sync.</em></h1><p className="lead">Create a room, invite your team, and build something great together.</p></section><section className="actions"><button className="primary" onClick={create}>＋ Create a room</button><form onSubmit={join}><input placeholder="Enter room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} /><button className="secondary">Join room</button></form></section>{error && <p className="error">{error}</p>}<section className="rooms"><h2>Your rooms</h2>{rooms.length ? rooms.map((room) => <button className="room-row" key={room.roomId} onClick={() => navigate(`/rooms/${room.roomId}`)}><strong>{room.roomId}</strong><span className="room-row-details"><span>{room.language}</span><span className="room-delete" role="button" tabIndex="0" onClick={(event) => removeRoom(event, room.roomId)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') removeRoom(event, room.roomId) }}>Delete</span></span></button>) : <p className="muted">Rooms you create or join will appear here.</p>}</section></main>
}
