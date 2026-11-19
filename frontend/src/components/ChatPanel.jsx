import { useState } from 'react'

export default function ChatPanel({ messages, onSend }) {
  const [text, setText] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    if (!text.trim()) return
    const result = await onSend(text)
    if (!result?.error) setText('')
  }
  return <section className="chat-panel"><h2>Chat</h2><div className="messages">{messages.map((message) => <article key={message._id}><strong>{message.sender?.name || 'User'}</strong><p>{message.text}</p></article>)}</div><form onSubmit={submit}><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a message..." /><button className="primary">Send</button></form></section>
}
