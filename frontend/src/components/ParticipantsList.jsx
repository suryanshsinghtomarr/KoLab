export default function ParticipantsList({ participants }) {
  return <section className="participants-panel"><h2>Participants <span className="muted">({participants.length})</span></h2><ul>{participants.map((participant) => <li key={participant.id}><span className="presence-dot" />{participant.name}</li>)}</ul></section>
}
