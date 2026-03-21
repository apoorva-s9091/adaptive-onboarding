import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import GraphView from '../components/graph/GraphView'
import CoverageBar from '../components/results/CoverageBar'
import CohortRing from '../components/results/CohortRing'

const DEMO_DATA = {
  coverage_percent: 58, gap_count: 6, estimated_days: 18,
  resume_skills: ['Python','SQL','Data Analysis','Excel','Statistics'],
  jd_skills: ['Python','Machine Learning','Deep Learning','NLP','Docker','SQL','Data Analysis','MLOps'],
  gaps: [
    { skill:'machine learning',similarity:0.28,onet_importance:0.9,priority_score:0.65,difficulty_level:'beginner' },
    { skill:'deep learning',similarity:0.15,onet_importance:0.85,priority_score:0.72,difficulty_level:'beginner' },
    { skill:'nlp',similarity:0.2,onet_importance:0.8,priority_score:0.64,difficulty_level:'beginner' },
    { skill:'docker',similarity:0.3,onet_importance:0.7,priority_score:0.49,difficulty_level:'intermediate' },
    { skill:'mlops',similarity:0.1,onet_importance:0.75,priority_score:0.67,difficulty_level:'beginner' },
    { skill:'statistics',similarity:0.6,onet_importance:0.65,priority_score:0.26,difficulty_level:'intermediate' },
  ],
  path: [
    { step:1,skill:'machine learning',difficulty:'beginner',course:'ML Crash Course — Google',prerequisites:['Python','Statistics'] },
    { step:2,skill:'deep learning',difficulty:'beginner',course:'Deep Learning Specialization — Andrew Ng',prerequisites:['machine learning'] },
    { step:3,skill:'nlp',difficulty:'beginner',course:'NLP Specialization — deeplearning.ai',prerequisites:['deep learning'] },
    { step:4,skill:'docker',difficulty:'intermediate',course:'Docker for Developers — Udemy',prerequisites:[] },
    { step:5,skill:'mlops',difficulty:'beginner',course:'MLOps Specialization — Coursera',prerequisites:['docker','machine learning'] },
  ],
  graph_nodes: ['python','sql','statistics','machine learning','deep learning','nlp','docker','mlops'],
  graph_edges: [
    {from:'python',to:'machine learning'},{from:'statistics',to:'machine learning'},
    {from:'machine learning',to:'deep learning'},{from:'deep learning',to:'nlp'},
    {from:'docker',to:'mlops'},{from:'machine learning',to:'mlops'},
  ],
}

export default function Demo() {
  const navigate = useNavigate()

  const loadDemo = () => {
    sessionStorage.setItem('onboarding_result', JSON.stringify(DEMO_DATA))
    navigate('/results')
  }

  return (
    <div style={{ background:'#0A0F1E',minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'100px 48px 60px' }}>
        <div style={{ textAlign:'center',marginBottom:48 }}>
          <div style={{ fontSize:12,fontWeight:600,color:'#4F6EF7',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:10 }}>Interactive Demo</div>
          <h1 style={{ fontSize:40,fontWeight:800,marginBottom:12,letterSpacing:'-0.02em' }}>See it in action</h1>
          <p style={{ fontSize:16,color:'#6B7280',marginBottom:28 }}>Pre-loaded: Python Developer resume applying for ML Engineer role</p>
          <button className="btn btn-primary" style={{ fontSize:15,padding:'14px 28px' }} onClick={loadDemo}>
            Open Full Dashboard →
          </button>
        </div>

        {/* Preview */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:14,marginBottom:24 }}>
          <CoverageBar percent={58} />
          <div style={{ background:'#111827',border:'1px solid #1F2D45',borderRadius:12,padding:'20px 24px' }}>
            <div style={{ fontSize:12,color:'#6B7280',marginBottom:8 }}>Gaps Found</div>
            <div style={{ fontSize:36,fontWeight:800,color:'#EF4444' }}>6</div>
            <div style={{ fontSize:12,color:'#4B5563' }}>skills to learn</div>
          </div>
          <div style={{ background:'#111827',border:'1px solid #1F2D45',borderRadius:12,padding:'20px 24px' }}>
            <div style={{ fontSize:12,color:'#6B7280',marginBottom:8 }}>Est. Time</div>
            <div style={{ fontSize:36,fontWeight:800,color:'#F59E0B' }}>18</div>
            <div style={{ fontSize:12,color:'#4B5563' }}>days to competency</div>
          </div>
          <CohortRing percent={64} skill="Python" />
        </div>
        <GraphView nodes={DEMO_DATA.graph_nodes} edges={DEMO_DATA.graph_edges} gaps={DEMO_DATA.gaps} />
      </div>
    </div>
  )
}
