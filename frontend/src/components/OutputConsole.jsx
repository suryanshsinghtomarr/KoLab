import { useState } from 'react'

export default function OutputConsole({ output, running }) {
  const [clearedOutput, setClearedOutput] = useState(null)
  const isCleared = Boolean(output) && clearedOutput === output

  return (
    <section className="output-console">
      <div className="output-heading">
        <div className="terminal-title">
          <span className="traffic-dot red" />
          <span className="traffic-dot yellow" />
          <span className="traffic-dot green" />
          <h2>Terminal</h2>
        </div>
        <div className="output-actions">
          {output && <button type="button" onClick={() => setClearedOutput(output)}>Clear</button>}
        </div>
      </div>
      <div className="terminal-body">
        {running && <p className="terminal-command">$ Executing code...</p>}
        {isCleared ? <p className="terminal-muted">Output cleared.</p> : output ? (
          <>
            {output.status && <p className="terminal-command">$ Status: {output.status}</p>}
            {output.stderr || output.compileOutput
              ? <pre className="terminal-error">{output.stderr || output.compileOutput}</pre>
              : <pre className="terminal-output">{output.stdout || 'No output'}</pre>}
            {output.time && <small className="terminal-meta">Completed in {output.time}s</small>}
          </>
        ) : !running ? <p className="terminal-muted">Run your code to see output here.</p> : null}
      </div>
    </section>
  )
}
