import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import CoverageBar from '../components/results/CoverageBar'
import CohortRing from '../components/results/CohortRing'
import PathCard from '../components/results/PathCard'
import GraphView from '../components/graph/GraphView'

export default function Results() {
  const [data, setData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const raw = sessionStorage.getItem('onboarding_result')
    if (!raw) { navigate('/'); return }
    setData(JSON.parse(raw))
  }, [])

  if (!data) return null

  const { resume_skills=[], jd_skills=[], coverage_percent=0, gap_count=0, gaps=[], path=[], graph_nodes=[], graph_edges=[], total_modules=0, estimated_days=0 } = data

  return (
    <div style={{ background:'#0A0F1E',minHeight:'100vh',display:'flex',flexDirection:'column' }}>
      <Navbar />
      <div style={{ display:'flex',flex:1,paddingTop:64 }}>
        <Sidebar path={path} currentStep={0} />

        {/* Main content */}
        <main style={{ flex:1,padding:'32px 36px',overflowY:'auto',maxHeight:'calc(100vh - 64px)' }}>

          {/* Page title */}
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:26,fontWeight:800,letterSpacing:'-0.02em' }}>Your Onboarding Dashboard</h1>
            <p style={{ fontSize:14,color:'#6B7280',marginTop:4 }}>
              {jd_skills.length} skills required · {gap_count} gaps identified · {total_modules} modules recommended
            </p>
          </div>

          {/* Stat cards row */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:14,marginBottom:24 }}>
            <CoverageBar percent={Math.round(coverage_percent)} />
            <div style={{ background:'#111827',border:'1px solid #1F2D45',borderRadius:12,padding:'20px 24px' }}>
              <div style={{ fontSize:12,color:'#6B7280',marginBottom:8,fontWeight:500 }}>Gaps Found</div>
              <div style={{ fontSize:36,fontWeight:800,color:'#EF4444',marginBottom:4 }}>{gap_count}</div>
              <div style={{ fontSize:12,color:'#4B5563' }}>skills to learn</div>
            </div>
            <div style={{ background:'#111827',border:'1px solid #1F2D45',borderRadius:12,padding:'20px 24px' }}>
              <div style={{ fontSize:12,color:'#6B7280',marginBottom:8,fontWeight:500 }}>Est. Time</div>
              <div style={{ fontSize:36,fontWeight:800,color:'#F59E0B',marginBottom:4 }}>{estimated_days}</div>
              <div style={{ fontSize:12,color:'#4B5563' }}>days to competency</div>
            </div>
            <CohortRing percent={73} skill={jd_skills[0] || 'SQL'} />
          </div>

          {/* Skill tags */}
          <div style={{ display:'flex',gap:12,marginBottom:24,flexWrap:'wrap' }}>
            <div style={{ flex:1,background:'#111827',border:'1px solid #1F2D45',borderRadius:12,padding:'16px 20px' }}>
              <div style={{ fontSize:12,color:'#4F6EF7',fontWeight:600,marginBottom:10 }}>Resume Skills</div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                {resume_skills.slice(0,12).map(s => (
                  <span key={s} style={{ fontSize:11,padding:'3px 10px',borderRadius:10,background:'rgba(79,110,247,0.1)',border:'1px solid rgba(79,110,247,0.2)',color:'#7B94FB' }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{ flex:1,background:'#111827',border:'1px solid #1F2D45',borderRadius:12,padding:'16px 20px' }}>
              <div style={{ fontSize:12,color:'#10B981',fontWeight:600,marginBottom:10 }}>Required Skills</div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                {jd_skills.slice(0,12).map(s => (
                  <span key={s} style={{ fontSize:11,padding:'3px 10px',borderRadius:10,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)',color:'#34D399' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* D3 Graph */}
          <div style={{ marginBottom:24 }}>
            <GraphView nodes={graph_nodes} edges={graph_edges} gaps={gaps} />
          </div>

          {/* Learning path */}
          <div>
            <div style={{ fontSize:14,fontWeight:700,marginBottom:14 }}>Your Learning Path</div>
            <div className="scroll-x" style={{ display:'flex',gap:14,paddingBottom:12 }}>
              {path.map(step => <PathCard key={step.step} step={step} />)}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
