import { useCallback, useEffect, useMemo, useState } from 'react'
import { getRoomMessages } from '../api/messageApi'
import { socket } from '../socket/socket'
import { debounce } from '../utils/debounce'

export default function useRoomSocket(roomId, initialLanguage) {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState(initialLanguage || 'javascript')
  const [messages, setMessages] = useState([])
  const [participants, setParticipants] = useState([])
  const [error, setError] = useState('')
  const [output, setOutput] = useState(null)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return undefined

    const onRoomState = ({ code: nextCode, language: nextLanguage }) => {
      setCode(nextCode || '')
      setLanguage(nextLanguage || 'javascript')
    }
    const onCodeChange = ({ code: nextCode }) => setCode(nextCode)
    const onLanguageChange = ({ language: nextLanguage }) => setLanguage(nextLanguage)
    const onRunStarted = () => setRunning(true)
    const onRunOutput = ({ output: nextOutput }) => { setOutput(nextOutput); setRunning(false) }
    socket.auth = { token }
    socket.on('connect_error', (event) => setError(event.message))
    socket.on('room-state', onRoomState)
    socket.on('code-change', onCodeChange)
    socket.on('language-change', onLanguageChange)
    socket.on('participants', setParticipants)
    socket.on('new-message', (message) => setMessages((current) => [...current, message]))
    socket.on('run-started', onRunStarted)
    socket.on('run-output', onRunOutput)
    socket.connect()
    getRoomMessages(roomId).then(({ data }) => setMessages(data.messages)).catch(() => setError('Could not load chat history'))
    socket.emit('join-room', roomId, (result) => { if (result?.error) setError(result.error) })

    return () => {
      socket.emit('leave-room', roomId)
      socket.off('connect_error')
      socket.off('room-state', onRoomState)
      socket.off('code-change', onCodeChange)
      socket.off('language-change', onLanguageChange)
      socket.off('participants', setParticipants)
      socket.off('new-message')
      socket.off('run-started', onRunStarted)
      socket.off('run-output', onRunOutput)
      socket.disconnect()
    }
  }, [roomId])

  const emitCode = useMemo(() => debounce((nextCode) => {
    socket.emit('code-change', { roomId, code: nextCode })
  }, 100), [roomId])

  useEffect(() => () => emitCode.cancel(), [emitCode])

  const changeCode = useCallback((nextCode) => {
    setCode(nextCode)
    emitCode(nextCode)
  }, [emitCode])

  const changeLanguage = useCallback((nextLanguage) => {
    setLanguage(nextLanguage)
    socket.emit('language-change', { roomId, language: nextLanguage })
  }, [roomId])

  const sendMessage = useCallback((text) => new Promise((resolve) => {
    socket.emit('send-message', { roomId, text }, resolve)
  }), [roomId])

  const setExecutionRunning = useCallback((nextRunning) => setRunning(nextRunning), [])
  const setExecutionOutput = useCallback((nextOutput) => setOutput(nextOutput), [])
  const setRoomLanguage = useCallback((nextLanguage) => setLanguage(nextLanguage), [])

  return { code, language, messages, participants, error, output, running, changeCode, changeLanguage, sendMessage, setExecutionRunning, setExecutionOutput, setRoomLanguage }
}
