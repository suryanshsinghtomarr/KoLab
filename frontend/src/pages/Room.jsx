import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as roomApi from '../api/roomApi'
import * as executeApi from '../api/executeApi'
import * as sessionApi from '../api/sessionApi'
import CodeEditor from '../components/CodeEditor'
import LanguageSelector from '../components/LanguageSelector'
import ChatPanel from '../components/ChatPanel'
import ParticipantsList from '../components/ParticipantsList'
import useRoomSocket from '../hooks/useRoomSocket'
import Toolbar from '../components/Toolbar'
import OutputConsole from '../components/OutputConsole'
import Toast from '../components/Toast'

export default function Room() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [room, setRoom] = useState(null)
  const [error, setError] = useState('')
  const liveRoom = useRoomSocket(roomId)
  const { changeCode } = liveRoom
  const [toast, setToast] = useState('')
  useEffect(() => { roomApi.getRoom(roomId).then(({ data }) => setRoom(data.room)).catch((err) => setError(err.response?.data?.message || 'Could not load room')) }, [roomId])
  useEffect(() => { if (location.state?.session) changeCode(location.state.session.code) }, [location.state, changeCode])
  const run = async () => { try { await executeApi.runCode({ roomId, code: liveRoom.code, language: liveRoom.language }) } catch (err) { setToast(err.response?.data?.message || 'Could not execute code') } }
  const save = async () => { try { await sessionApi.saveSession({ roomId, title: `${liveRoom.language} session`, code: liveRoom.code, language: liveRoom.language }); setToast('Session saved') } catch (err) { setToast(err.response?.data?.message || 'Could not save session') } }
  const copyLink = async () => { await navigator.clipboard.writeText(window.location.href); setToast('Room link copied') }
  if (error) return <main className="page"><p className="error">{error}</p></main>
  if (!room) return <div className="loading">Loading room...</div>
  return <main className="page room-page"><Toast message={toast} onClose={() => setToast('')} /><div className="room-header"><div><p className="eyebrow">ROOM</p><h1>{room.roomId}</h1></div><LanguageSelector language={liveRoom.language} onChange={liveRoom.changeLanguage} /></div><Toolbar onRun={run} onSave={save} onCopy={copyLink} onLeave={() => navigate('/')} running={liveRoom.running} />{liveRoom.error && <p className="error">{liveRoom.error}</p>}<div className="room-layout"><section><div className="editor-card"><CodeEditor code={liveRoom.code} language={liveRoom.language} onChange={liveRoom.changeCode} /></div><OutputConsole output={liveRoom.output} running={liveRoom.running} /></section><aside><ParticipantsList participants={liveRoom.participants} /><ChatPanel messages={liveRoom.messages} onSend={liveRoom.sendMessage} /></aside></div></main>
}
