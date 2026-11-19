import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as roomApi from '../api/roomApi'
import * as executeApi from '../api/executeApi'
import * as sessionApi from '../api/sessionApi'
import CodeEditor from '../components/CodeEditor'
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
  const liveRoom = useRoomSocket(roomId, room?.language)
  const { changeCode } = liveRoom
  const [toast, setToast] = useState('')
  const [toastKey, setToastKey] = useState(0)
  const showToast = useCallback((message) => {
    setToast(message)
    setToastKey((currentKey) => currentKey + 1)
  }, [])
  const closeToast = useCallback(() => setToast(''), [])
  useEffect(() => { roomApi.getRoom(roomId).then(({ data }) => setRoom(data.room)).catch((err) => setError(err.response?.data?.message || 'Could not load room')) }, [roomId])
  useEffect(() => { if (location.state?.session) changeCode(location.state.session.code) }, [location.state, changeCode])
  const run = async () => {
    const code = liveRoom.code || ''
    if (!code.trim()) {
      liveRoom.setExecutionOutput({
        stdout: '',
        stderr: 'The editor is empty. Add code before running.',
        compileOutput: '',
        status: 'Failed',
        time: null,
      })
      liveRoom.setExecutionRunning(false)
      return
    }

    const languageMismatch = (
      (liveRoom.language === 'javascript' && /\bprint\s*\(/.test(code))
      || (liveRoom.language === 'typescript' && /\bprint\s*\(/.test(code))
    )
    if (languageMismatch) {
      liveRoom.setExecutionOutput({
        stdout: '',
        stderr: `This room is set to ${liveRoom.language}. Use console.log(...) for JavaScript/TypeScript output, or create a room with Python selected.`,
        compileOutput: '',
        status: 'Language mismatch',
        time: null,
      })
      liveRoom.setExecutionRunning(false)
      return
    }

    liveRoom.setExecutionRunning(true)
    try {
      const { data } = await executeApi.runCode({ roomId, code, language: liveRoom.language })
      liveRoom.setExecutionOutput(data.output)
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Could not execute code'
      liveRoom.setExecutionOutput({
        stdout: '',
        stderr: message,
        compileOutput: '',
        status: 'Failed',
        time: null,
      })
      showToast('Code execution failed')
    } finally {
      liveRoom.setExecutionRunning(false)
    }
  }
  const save = async () => { try { await sessionApi.saveSession({ roomId, title: `${liveRoom.language} session`, code: liveRoom.code, language: liveRoom.language }); showToast('Session saved') } catch (err) { showToast(err.response?.data?.message || 'Could not save session') } }
  const copyRoomCode = async () => { await navigator.clipboard.writeText(roomId); showToast('Room code copied') }
  if (error) return <main className="page"><p className="error">{error}</p></main>
  if (!room) return <div className="loading">Loading room...</div>
  return (
    <main className="page room-page">
      <Toast key={toastKey} message={toast} onClose={closeToast} duration={3000} />
      <Toolbar roomId={room.roomId} language={liveRoom.language} onRun={run} onSave={save} onCopy={copyRoomCode} onLeave={() => navigate('/')} running={liveRoom.running} />
      {liveRoom.error && <p className="error room-error">{liveRoom.error}</p>}
      <div className="room-layout">
        <aside className="participants-column">
          <ParticipantsList participants={liveRoom.participants} />
        </aside>
        <section className="editor-column">
          <div className="editor-card"><CodeEditor code={liveRoom.code} language={liveRoom.language} onChange={liveRoom.changeCode} /></div>
          <OutputConsole output={liveRoom.output} running={liveRoom.running} />
        </section>
        <aside className="chat-column">
          <ChatPanel messages={liveRoom.messages} onSend={liveRoom.sendMessage} participants={liveRoom.participants} />
        </aside>
      </div>
    </main>
  )
}
