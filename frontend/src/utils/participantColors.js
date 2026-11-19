export const PARTICIPANT_COLORS = [
  '#10B981',
  '#EF4444',
  '#F59E0B',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#6366F1',
]

const normalizeKey = (value) => String(value || '').trim().toLowerCase()

export function getParticipantColor(key, participants = []) {
  const normalizedKey = normalizeKey(key)
  const activeIndex = participants.findIndex((participant) => {
    const participantKeys = [
      participant.id,
      participant._id,
      participant.name,
      participant.email,
    ].map(normalizeKey)
    return participantKeys.includes(normalizedKey)
  })

  if (activeIndex >= 0) return PARTICIPANT_COLORS[activeIndex % PARTICIPANT_COLORS.length]

  let hash = 0
  for (let index = 0; index < normalizedKey.length; index += 1) {
    hash = ((hash << 5) - hash + normalizedKey.charCodeAt(index)) | 0
  }
  return PARTICIPANT_COLORS[Math.abs(hash) % PARTICIPANT_COLORS.length]
}
