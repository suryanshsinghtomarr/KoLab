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
  return <main className="page dashboard">
    <Toast message={toast} type="error" onClose={() => setToast('')} />
    <div className="room-header"><div><p className="eyebrow">WORKSPACE</p><h1>Dashboard</h1></div><button className="neutral-action dashboard-new-room" onClick={() => navigate('/')}>＋ New room</button></div>
    <section className="rooms">
      <h2>Your rooms</h2>
      {rooms.length ? rooms.map((room) => <article className="room-row" key={room.roomId} onClick={() => navigate(`/rooms/${room.roomId}`)}>
        <div className="room-title"><strong>{room.name?.trim() || room.roomName?.trim() || room.title?.trim() || room.roomId}</strong><span className="room-code-muted">{room.roomId || room.code}</span></div>
        <span className="room-row-details"><span>{room.language}</span><button className="room-delete" type="button" aria-label="Delete room" title="Delete room" onClick={(event) => deleteRoom(event, room.roomId)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-1 12H8L7 9Zm3 2v7h2v-7h-2Zm4 0v7h2v-7h-2Z" /></svg>
        </button></span>
      </article>) : <p className="muted">No rooms yet.</p>}
    </section>
    <section className="rooms saved-sessions"><h2>Saved sessions</h2>{sessions.length ? sessions.map((session) => <SessionCard key={session._id} session={session} onLoad={(item) => navigate(`/rooms/${item.roomId}`, { state: { session: item } })} onDelete={deleteSession} />) : <p className="muted">Saved code sessions will appear here.</p>}</section>
  </main>
}
