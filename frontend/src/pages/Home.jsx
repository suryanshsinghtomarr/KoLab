import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as roomApi from '../api/roomApi'

export default function Home() {
  const [roomId, setRoomId] = useState('')
  const [roomName, setRoomName] = useState('')
  const [roomLanguage, setRoomLanguage] = useState('javascript')
  const [showCreate, setShowCreate] = useState(false)
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  useEffect(() => { roomApi.getMyRooms().then(({ data }) => setRooms(data.rooms)).catch(() => setError('Could not load your rooms')) }, [])
  const removeRoom = async (event, roomId) => {
    event.stopPropagation()
    try { await roomApi.deleteRoom(roomId); setRooms((current) => current.filter((room) => room.roomId !== roomId)) } catch (err) { setError(err.response?.data?.message || 'Could not delete room') }
  }
  const create = async (event) => {
    event.preventDefault()
    const name = roomName.trim()
    if (!name) {
      setError('Enter a room name')
      return
    }
    try {
      const { data } = await roomApi.createRoom({ name, roomName: name, title: name, language: roomLanguage })
      setRoomName('')
      setRoomLanguage('javascript')
      setShowCreate(false)
      navigate(`/rooms/${data.room.roomId}`)
    } catch {
      setError('Could not create room')
    }
  }
  const join = async (e) => { e.preventDefault(); if (!roomId.trim()) return; try { await roomApi.joinRoom(roomId.trim().toUpperCase()); navigate(`/rooms/${roomId.trim().toUpperCase()}`) } catch (err) { setError(err.response?.data?.message || 'Room not found') } }
  return <main className="page home-page">
    <section className="hero-copy">
      <p className="eyebrow">COLLABORATE IN REAL TIME</p>
      <h1>Your ideas,<br /><em>in sync.</em></h1>
      <p className="lead">Create a room, invite your team, and build something great together.</p>
    </section>
    <section className="actions">
      <button className="neutral-action" type="button" onClick={() => setShowCreate((visible) => !visible)}>＋ Create a room</button>
      {showCreate && <form className="create-room-form" onSubmit={create}>
        <input aria-label="Room name" placeholder="Enter room name" value={roomName} onChange={(event) => setRoomName(event.target.value)} autoFocus />
        <select aria-label="Language" value={roomLanguage} onChange={(event) => setRoomLanguage(event.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button className="secondary" type="submit">Create</button>
      </form>}
      <form onSubmit={join}>
        <input placeholder="Enter room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
        <button className="secondary">Join room</button>
      </form>
    </section>
    {error && <p className="error">{error}</p>}
    <section className="rooms">
      <h2>Your rooms</h2>
      {rooms.length ? rooms.map((room) => <article className="room-row" key={room.roomId} onClick={() => navigate(`/rooms/${room.roomId}`)}>
        <div className="room-title"><strong>{room.name?.trim() || room.roomName?.trim() || room.title?.trim() || room.roomId}</strong><span className="room-code-muted">{room.roomId || room.code}</span></div>
        <span className="room-row-details"><span>{room.language}</span><button className="room-delete" type="button" aria-label="Delete room" title="Delete room" onClick={(event) => removeRoom(event, room.roomId)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-1 12H8L7 9Zm3 2v7h2v-7h-2Zm4 0v7h2v-7h-2Z" /></svg>
        </button></span>
      </article>) : <div className="rooms-empty"><p>Rooms you create or join will appear here.</p></div>}
    </section>
  </main>
}
