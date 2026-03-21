import { useNavigate } from 'react-router-dom'

export default function Sidebar({ path = [], currentStep = 0 }) {
  const navigate = useNavigate()

  const levelColor = { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' }

  return (
    <aside style={{
      width: 260,
      minHeight: '100vh',
      background: '#0d1421',
      borderRight: '1px solid #1F2D45',
      padding: '32px 20px',
      flexShrink: 0,
    }}>
      {/* User info */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4F6EF7, #10B981)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10,
        }}>N</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#F9FAFB' }}>New Hire</div>
        <div style={{
          display: 'inline-block', marginTop: 4,
          fontSize: 11, fontWeight: 500, color: '#7B94FB',
          background: 'rgba(79,110,247,0.12)', border: '1px solid rgba(79,110,247,0.2)',
          borderRadius: 10, padding: '2px 8px',
        }}>Onboarding</div>
      </div>

      {/* Progress label */}
      <div style={{ fontSize: 11, fontWeight: 600, color: '#4B5563', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 16 }}>
        Learning Path
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {path.map((step, i) => {
          const done = i < currentStep
          const active = i === currentStep
          return (
            <div
              key={i}
              onClick={() => navigate(`/quiz/${encodeURIComponent(step.skill)}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                background: active ? 'rgba(79,110,247,0.1)' : 'transparent',
                border: active ? '1px solid rgba(79,110,247,0.25)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
            >
              {/* Step circle */}
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                background: done ? '#10B981' : active ? '#4F6EF7' : 'transparent',
                border: done ? 'none' : active ? 'none' : '2px solid #1F2D45',
                color: done || active ? '#fff' : '#4B5563',
                boxShadow: active ? '0 0 12px rgba(79,110,247,0.5)' : 'none',
                animation: active ? 'pulseDot 2s infinite' : 'none',
              }}>
                {done ? '✓' : i + 1}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  color: active ? '#F9FAFB' : done ? '#9CA3AF' : '#6B7280',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{step.skill}</div>
                <div style={{
                  fontSize: 10, marginTop: 1,
                  color: levelColor[step.difficulty] || '#9CA3AF',
                }}>{step.difficulty}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Export button */}
      {path.length > 0 && (
        <button
          className="btn btn-ghost"
          style={{ width: '100%', marginTop: 24, justifyContent: 'center', fontSize: 13 }}
          onClick={() => {
            const data = JSON.stringify(path, null, 2)
            const blob = new Blob([data], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = 'learning-path.json'; a.click()
          }}
        >
          ↓ Export Path
        </button>
      )}
    </aside>
  )
}
