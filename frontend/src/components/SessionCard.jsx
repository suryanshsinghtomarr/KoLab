export default function SessionCard({ session, onLoad, onDelete }) {
  return <article className="session-card"><div><strong>{session.title}</strong><p className="muted">{session.language} · {new Date(session.savedAt).toLocaleString()}</p></div><div className="session-actions"><button className="toolbar-button" onClick={() => onLoad(session)}>Load</button><button className="toolbar-button leave-button" onClick={() => onDelete(session._id)}>Delete</button></div></article>
}
