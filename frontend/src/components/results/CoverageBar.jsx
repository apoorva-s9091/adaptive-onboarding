import { useEffect, useState } from 'react'

export default function CoverageBar({ percent = 0 }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(percent), 100)
    return () => clearTimeout(timer)
  }, [percent])

  const color = percent >= 70 ? '#10B981' : percent >= 40 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{
      background: '#111827', border: '1px solid #1F2D45', borderRadius: 12, padding: '20px 24px',
    }}>
      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8, fontWeight: 500 }}>Skill Coverage</div>
      <div style={{ fontSize: 36, fontWeight: 800, color, marginBottom: 12 }}>{displayed}%</div>
      <div style={{ height: 8, background: '#1A2235', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4,
          width: `${displayed}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          transition: 'width 1.4s cubic-bezier(.4,0,.2,1)',
          boxShadow: `0 0 12px ${color}66`,
        }} />
      </div>
      <div style={{ fontSize: 12, color: '#4B5563', marginTop: 6 }}>
        of required skills matched
      </div>
    </div>
  )
}
