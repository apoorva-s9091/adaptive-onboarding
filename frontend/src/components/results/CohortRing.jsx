import { useEffect, useState } from 'react'

export default function CohortRing({ percent = 73, skill = 'SQL' }) {
  const [progress, setProgress] = useState(0)
  const r = 46, cx = 60, cy = 60
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ

  useEffect(() => {
    const t = setTimeout(() => setProgress(percent), 300)
    return () => clearTimeout(t)
  }, [percent])

  return (
    <div style={{
      background: '#111827', border: '1px solid #1F2D45', borderRadius: 12,
      padding: '20px 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12, fontWeight: 500 }}>Cohort Rank</div>
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ display: 'block', margin: '0 auto' }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1A2235" strokeWidth="8" />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#10B981"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#F9FAFB" fontSize="20" fontWeight="700" fontFamily="Syne">{progress}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="Syne">ahead</text>
      </svg>
      <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
        of peers on <span style={{ color: '#10B981', fontWeight: 600 }}>{skill}</span>
      </div>
    </div>
  )
}
