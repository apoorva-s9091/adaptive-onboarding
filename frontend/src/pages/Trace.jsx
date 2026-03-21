import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import TracePanel from '../components/quiz/TracePanel'

export default function Trace() {
  const { skill } = useParams()
  const navigate = useNavigate()
  const [reasoning, setReasoning] = useState('')
  const [loading, setLoading] = useState(true)

  const data = JSON.parse(sessionStorage.getItem('onboarding_result') || '{}')
  const gap = data.gaps?.find(g => g.skill?.toLowerCase() === skill?.toLowerCase())
  const pathStep = data.path?.find(p => p.skill?.toLowerCase() === skill?.toLowerCase())

  useEffect(() => {
    // Generate reasoning trace via API
    import('../api/client').then(({ submitQuiz }) => {
      submitQuiz({
        skill, level: gap?.difficulty_level || 'intermediate',
        questions: [], answers: [],
        years_experience: 0,
        semantic_similarity: gap?.similarity || 0.5,
        onet_importance: gap?.onet_importance || 0.5,
        priority_score: gap?.priority_score || 0.5,
      }).then(r => {
        setReasoning(r.data.reasoning || 'No reasoning available.')
        setLoading(false)
      }).catch(() => {
        setReasoning(`Reasoning: This skill was identified as a gap based on semantic analysis of your resume vs the job description.\n\nRecommendation: Based on your experience level and quiz performance, we recommend starting with the ${gap?.difficulty_level || 'intermediate'} track for ${skill}. This will build the foundational knowledge required for your target role while skipping concepts you already know.`)
        setLoading(false)
      })
    })
  }, [skill])

  const levelStyle = {
    beginner:     { bg:'rgba(16,185,129,0.12)',color:'#34D399' },
    intermediate: { bg:'rgba(245,158,11,0.12)',color:'#FCD34D' },
    advanced:     { bg:'rgba(239,68,68,0.12)',color:'#F87171' },
  }
  const ls = levelStyle[gap?.difficulty_level] || levelStyle.intermediate

  return (
    <div style={{ background:'#0A0F1E',minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:800,margin:'0 auto',padding:'100px 24px 60px' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize:13,color:'#4B5563',marginBottom:24,display:'flex',alignItems:'center',gap:8 }}>
          <span style={{ cursor:'pointer',color:'#4F6EF7' }} onClick={() => navigate('/results')}>Results</span>
          <span>›</span>
          <span style={{ cursor:'pointer',color:'#4F6EF7' }} onClick={() => navigate('/quiz/'+encodeURIComponent(skill))}>Quiz</span>
          <span>›</span>
          <span style={{ textTransform:'capitalize' }}>Reasoning: {skill}</span>
        </div>

        {/* Header */}
        <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:28 }}>
          <h1 style={{ fontSize:28,fontWeight:800,textTransform:'capitalize',letterSpacing:'-0.02em' }}>{skill}</h1>
          {gap?.difficulty_level && (
            <span style={{ fontSize:12,fontWeight:600,background:ls.bg,color:ls.color,borderRadius:10,padding:'4px 14px' }}>
              {gap.difficulty_level}
            </span>
          )}
        </div>

        {/* Reasoning trace */}
        <div style={{ marginBottom:24 }}>
          <TracePanel reasoning={reasoning} loading={loading} />
        </div>

        {/* Course card */}
        {pathStep && (
          <div style={{ background:'#111827',border:'1px solid #1F2D45',borderRadius:14,padding:'24px',marginBottom:24 }}>
            <div style={{ fontSize:12,color:'#4B5563',marginBottom:8,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase' }}>Recommended Course</div>
            <div style={{ fontSize:16,fontWeight:700,color:'#F9FAFB',marginBottom:12 }}>{pathStep.course}</div>
            <div style={{ display:'flex',gap:10 }}>
              <span style={{ fontSize:12,padding:'3px 10px',borderRadius:10,background:'rgba(79,110,247,0.1)',border:'1px solid rgba(79,110,247,0.2)',color:'#7B94FB' }}>
                {pathStep.difficulty}
              </span>
              <span style={{ fontSize:12,padding:'3px 10px',borderRadius:10,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)',color:'#34D399' }}>
                ~2-3 weeks
              </span>
            </div>
          </div>
        )}

        {/* Nav */}
        <div style={{ display:'flex',gap:12,justifyContent:'space-between' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/results')}>Back to Results</button>
          <button className="btn btn-primary" onClick={() => navigate('/quiz/'+encodeURIComponent(skill))}>Take Quiz →</button>
        </div>
      </div>
    </div>
  )
}
