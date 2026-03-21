import { useNavigate } from 'react-router-dom'

const levelStyle = {
  beginner:     { bg: 'rgba(16,185,129,0.12)',  color: '#34D399', border: 'rgba(16,185,129,0.25)' },
  intermediate: { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D', border: 'rgba(245,158,11,0.25)' },
  advanced:     { bg: 'rgba(239,68,68,0.12)',  color: '#F87171', border: 'rgba(239,68,68,0.25)' },
}

export default function PathCard({ step }) {
  const navigate = useNavigate()
  const ls = levelStyle[step.difficulty] || levelStyle.intermediate

  return (
    <div
      className="card-hover hover-glow"
      style={{
        minWidth: 240, maxWidth: 240,
        background: '#111827',
        border: '1px solid #1F2D45',
        borderRadius: 14,
        padding: '20px',
        display: 'flex', flexDirection: 'column', gap: 10,
        flexShrink: 0,
      }}
    >
      {/* Step number */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#4F6EF7',
          background: 'rgba(79,110,247,0.12)', border: '1px solid rgba(79,110,247,0.2)',
          borderRadius: 6, padding: '2px 8px',
        }}>Step {step.step}</span>
        <span style={{
          fontSize: 11, fontWeight: 600,
          background: ls.bg, color: ls.color,
          border: `1px solid ${ls.border}`,
          borderRadius: 10, padding: '2px 8px',
        }}>{step.difficulty}</span>
      </div>

      {/* Skill name */}
      <div style={{ fontSize: 15, fontWeight: 700, color: '#F9FAFB', textTransform: 'capitalize' }}>
        {step.skill}
      </div>

      {/* Course */}
      <div style={{
        fontSize: 12, color: '#6B7280', lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {step.course}
      </div>

      {/* Prerequisites */}
      {step.prerequisites?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {step.prerequisites.map(p => (
            <span key={p} style={{
              fontSize: 10, padding: '2px 6px', borderRadius: 6,
              background: '#1A2235', border: '1px solid #2a3a50', color: '#4B5563',
            }}>Needs: {p}</span>
          ))}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => navigate(`/quiz/${encodeURIComponent(step.skill)}`)}
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', fontSize: 13, marginTop: 4 }}
      >
        Start Quiz →
      </button>
    </div>
  )
}
