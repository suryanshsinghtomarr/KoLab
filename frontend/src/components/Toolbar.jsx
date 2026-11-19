import { useState } from 'react'
export default function Toolbar({ roomId, language, onRun, onSave, onCopy, onLeave, running }) {
  const [saved, setSaved] = useState(false)
  const save = async () => { await onSave(); setSaved(true); setTimeout(() => setSaved(false), 1800) }
  return <div className="workspace-toolbar"><div className="toolbar-controls"><span className="language-badge" title="Room language">{language}</span><button className="workspace-button run-button" onClick={onRun} disabled={running}>{running ? 'Running...' : '▶ Run'}</button><button className="workspace-button" onClick={save}>{saved ? 'Saved' : 'Save'}</button><button className="workspace-button leave-button" onClick={onLeave}>Leave</button></div><div className="room-identity"><span className="room-code">{roomId}</span><button className="copy-room-button" type="button" onClick={onCopy} aria-label="Copy room code" title="Copy room code">⧉</button></div></div>
}
