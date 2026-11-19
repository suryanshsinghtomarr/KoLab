export default function OutputConsole({ output, running }) {
  return <section className="output-console"><div className="output-heading"><h2>Output</h2>{running && <span className="muted">Running...</span>}</div>{output ? <><pre className={output.stderr || output.compileOutput ? 'output-error' : ''}>{output.stdout || output.stderr || output.compileOutput || output.status || 'No output'}</pre><small className="muted">{output.status}{output.time ? ` · ${output.time}s` : ''}</small></> : <p className="muted">Run your code to see output here.</p>}</section>
}
