import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as roomApi from '../api/roomApi'
import * as sessionApi from '../api/sessionApi'
import Loader from '../components/Loader'
import SessionCard from '../components/SessionCard'
import Toast from '../components/Toast'

export default function Dashboard() {
  const [rooms, setRooms] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    Promise.all([roomApi.getMyRooms(), sessionApi.getMySessions()])
      .then(([roomResponse, sessionResponse]) => { setRooms(roomResponse.data.rooms); setSessions(sessionResponse.data.sessions) })
      .catch(() => setToast('Could not load dashboard'))
      .finally(() => setLoading(false))
  }, [])
  const deleteSession = async (id) => {
    try { await sessionApi.deleteSession(id); setSessions((current) => current.filter((session) => session._id !== id)) } catch { setToast('Could not delete session') }
  }
  const deleteRoom = async (event, roomId) => {
    event.stopPropagation()
    try { await roomApi.deleteRoom(roomId); setRooms((current) => current.filter((room) => room.roomId !== roomId)) } catch { setToast('Could not delete room') }
  }
  if (loading) return <Loader />
  return <main className="page dashboard"><Toast message={toast} type="error" onClose={() => setToast('')} /><div className="room-header"><div><p className="eyebrow">WORKSPACE</p><h1>Dashboard</h1></div><button className="primary" onClick={() => navigate('/')}>＋ New room</button></div><section className="rooms"><h2>Your rooms</h2>{rooms.length ? rooms.map((room) => <button className="room-row" key={room.roomId} onClick={() => navigate(`/rooms/${room.roomId}`)}><strong>{room.roomId}</strong><span className="room-row-details"><span>{room.language}</span><span className="room-delete" role="button" tabIndex="0" onClick={(event) => deleteRoom(event, room.roomId)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') deleteRoom(event, room.roomId) }}>Delete</span></span></button>) : <p className="muted">No rooms yet.</p>}</section><section className="rooms saved-sessions"><h2>Saved sessions</h2>{sessions.length ? sessions.map((session) => <SessionCard key={session._id} session={session} onLoad={(item) => navigate(`/rooms/${item.roomId}`, { state: { session: item } })} onDelete={deleteSession} />) : <p className="muted">Saved code sessions will appear here.</p>}</section></main>
}
