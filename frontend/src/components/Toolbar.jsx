import { useState } from 'react'

export default function Toolbar({ onRun, onSave, onCopy, onLeave, running }) {
  const [saved, setSaved] = useState(false)
  const save = async () => { await onSave(); setSaved(true); setTimeout(() => setSaved(false), 1800) }
  return <div className="toolbar"><button className="primary" onClick={onRun} disabled={running}>{running ? 'Running...' : '▶ Run'}</button><button className="secondary" onClick={save}>{saved ? 'Saved' : 'Save session'}</button><button className="toolbar-button" onClick={onCopy}>Copy room link</button><button className="toolbar-button leave-button" onClick={onLeave}>Leave</button></div>
}
