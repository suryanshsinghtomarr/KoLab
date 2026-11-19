import { useAuth } from '../context/useAuth'
import { getParticipantColor } from '../utils/participantColors'

export default function ParticipantsList({ participants }) {
  const { user } = useAuth()
  const currentUserId = user?.id || user?._id

  return (
    <section className="participants-panel">
      <div className="panel-heading"><h2>Participants</h2><span className="participant-count">{participants.length}</span></div>
      <ul>{participants.map((participant) => {
        const isCurrentUser = currentUserId
          ? String(participant.id) === String(currentUserId)
          : participant.name === user?.name
        const avatarColor = getParticipantColor(participant.id || participant.name, participants)
        const initial = (participant.name || 'U').charAt(0).toUpperCase()
        return <li key={participant.id}><span className="participant-avatar" style={{ backgroundColor: avatarColor }}>{initial}</span><span>{participant.name}{isCurrentUser && <small className="participant-you">(you)</small>}</span><small>Online</small></li>
      })}</ul>
      <div className="participants-footer"><span className="presence-dot" /><span>{participants.length} {participants.length === 1 ? 'user' : 'users'}</span></div>
    </section>
  )
}
