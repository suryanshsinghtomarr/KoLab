import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { getParticipantColor } from '../utils/participantColors'

export default function ChatPanel({ messages, onSend, participants = [] }) {
  const [text, setText] = useState('')
  const messagesRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages])

  const submit = async (event) => {
    event.preventDefault()
    if (!text.trim()) return
    const result = await onSend(text)
    if (!result?.error) setText('')
  }

  const currentUserId = user?.id || user?._id

  return (
    <section className="chat-panel">
      <header className="chat-header">
        <div className="chat-title">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9l-5.5 4H4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1 3v2h14V7H5Zm0 4v2h9v-2H5Z" /></svg>
          <h2>Chat</h2>
        </div>
        <span className="message-count" aria-label={`${messages.length} messages`}>{messages.length}</span>
      </header>
      <div className="messages" ref={messagesRef}>
        {messages.length > 0 && <div className="date-separator"><span>Today</span></div>}
        {messages.map((message) => {
          const senderId = message.sender?._id || message.sender?.id
          const outgoing = senderId && currentUserId ? String(senderId) === String(currentUserId) : message.sender?.name === user?.name
          const timestamp = message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Now'
          const senderName = message.sender?.name || 'User'
          const senderColor = getParticipantColor(senderId || senderName, participants)
          return (
            <article className={`message-row ${outgoing ? 'outgoing' : 'incoming'}`} key={message._id}>
              <div className="message-bubble">
                {!outgoing && <div className="message-sender"><span className="message-dot" style={{ backgroundColor: senderColor }} /><strong>{senderName}</strong></div>}
                <p>{message.text}</p>
                <time>{timestamp}</time>
              </div>
            </article>
          )
        })}
      </div>
      <form className="chat-form" onSubmit={submit}>
        <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Type a message..." aria-label="Type a message" />
        <button type="submit" aria-label="Send message" title="Send message">
          <svg className="send-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20.5v-17L22 12 3 20.5Zm2-3.2 11.7-5.3L5 6.7v3.5l7 1.8-7 1.8v.5Z" /></svg>
        </button>
      </form>
    </section>
  )
}
