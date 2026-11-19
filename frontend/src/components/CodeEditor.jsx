import Editor from '@monaco-editor/react'

export default function CodeEditor({ code, language, onChange }) {
  return <div className="code-editor"><Editor height="100%" theme="vs-dark" language={language} value={code} onChange={(value) => onChange(value || '')} options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, padding: { top: 14, bottom: 14 }, scrollBeyondLastLine: false }} /></div>
}
