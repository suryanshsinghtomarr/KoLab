import { useState } from 'react'
import LanguageSelector from './LanguageSelector'

export default function Toolbar({ roomId, language, onLanguageChange, onRun, onSave, onCopy, onLeave, running }) {
  const [saved, setSaved] = useState(false)
  const save = async () => { await onSave(); setSaved(true); setTimeout(() => setSaved(false), 1800) }
  return <div className="workspace-toolbar"><div className="room-identity"><span className="room-code">{roomId}</span><button className="copy-room-button" type="button" onClick={onCopy} aria-label="Copy room link" title="Copy room link">⧉</button></div><div className="toolbar-controls"><LanguageSelector language={language} onChange={onLanguageChange} /><button className="workspace-button run-button" onClick={onRun} disabled={running}>{running ? 'Running...' : '▶ Run'}</button><button className="workspace-button" onClick={save}>{saved ? 'Saved' : 'Save'}</button><button className="workspace-button leave-button" onClick={onLeave}>Leave</button></div></div>
}
