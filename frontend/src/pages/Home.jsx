import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import DropZone from '../components/upload/DropZone'
import { analyzeFiles } from '../api/client'

const FEATURES = [
  { icon: '🧠', title: 'Semantic skill matching', desc: 'MiniLM embeddings — "data analysis" partially covers "business intelligence". No false gaps.', color: '#4F6EF7' },
  { icon: '📊', title: 'Adaptive confidence scoring', desc: 'Your level is set by quiz + experience + semantic similarity. Not just resume claims.', color: '#10B981' },
  { icon: '🕸', title: 'Knowledge graph pathing', desc: 'Topological sort ensures prerequisites come first. Learn Python before ML — always.', color: '#8B5CF6' },
  { icon: '💡', title: 'AI reasoning trace', desc: 'Every recommendation has an explanation. DeepSeek-R1 tells you exactly why each module was chosen.', color: '#F59E0B' },
  { icon: '🎯', title: 'Diagnostic quiz engine', desc: 'Auto-generated MCQs validate resume claims. Score low? Path adjusts to beginner. High? Skip ahead.', color: '#14B8A6' },
  { icon: '👥', title: 'Cohort benchmarking', desc: 'See how you compare to peers. "Ahead of 73% on SQL" gives real context to your gaps.', color: '#EF4444' },
]

const TESTIMONIALS = [
  { text: '"I joined as a Data Analyst with 2 years experience. SynapseOnboard skipped everything I knew and went straight to my gaps. Saved me 3 weeks."', name: 'Arjun R.', role: 'Data Analyst · TechCorp', color: '#4F6EF7' },
  { text: '"The knowledge graph was a game changer. I could see which skills unlocked which — made the learning order make sense for the first time."', name: 'Sara K.', role: 'ML Engineer · Finova', color: '#10B981' },
  { text: '"The quiz engine caught that I didn\'t understand Docker as well as my resume suggested. The beginner path it gave me was spot on."', name: 'Mihail P.', role: 'DevOps Engineer · CloudBase', color: '#F59E0B' },
]

export default function Home() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jdFile, setJdFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const uploadRef = useRef()

  const handleAnalyze = async () => {
    if (!resumeFile || !jdFile) { setError('Please upload both files first.'); return }
    setLoading(true); setError('')
    try {
      const res = await analyzeFiles(resumeFile, jdFile)
      sessionStorage.setItem('onboarding_result', JSON.stringify(res.data))
      navigate('/results')
    } catch (e) {
      setError('Analysis failed. Make sure the backend is running.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '80px 48px 60px', position: 'relative', overflow: 'hidden' }} className="dot-grid">
        {/* Glows */}
        <div style={{ position:'absolute',top:-100,left:-100,width:500,height:500,background:'rgba(79,110,247,0.07)',borderRadius:'50%',pointerEvents:'none',filter:'blur(60px)' }} />
        <div style={{ position:'absolute',bottom:-80,right:-80,width:400,height:400,background:'rgba(16,185,129,0.05)',borderRadius:'50%',pointerEvents:'none',filter:'blur(60px)' }} />

        <div style={{ flex:1.1, zIndex:1 }}>
          {/* Badge */}
          <div className="fade-up" style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(79,110,247,0.1)',border:'1px solid rgba(79,110,247,0.25)',borderRadius:20,padding:'6px 14px',fontSize:12,color:'#7B94FB',marginBottom:24 }}>
            <span className="pulse-dot" />
            Powered by DeepSeek-R1 · MiniLM · NetworkX
          </div>
          {/* H1 */}
          <h1 className="fade-up-1" style={{ fontSize:56,fontWeight:800,lineHeight:1.1,marginBottom:18,letterSpacing:'-0.03em' }}>
            Onboard Smarter.<br />
            Learn Only What<br />
            <span className="gradient-text">You Don't Know Yet.</span>
          </h1>
          <p className="fade-up-2" style={{ fontSize:16,color:'#9CA3AF',lineHeight:1.8,marginBottom:32,maxWidth:500 }}>
            Upload your resume and job description. Our AI identifies your exact skill gaps and builds a personalized learning path — so you reach role competency in days, not months.
          </p>
          {/* CTAs */}
          <div className="fade-up-3" style={{ display:'flex',gap:12,marginBottom:36 }}>
            <button className="btn btn-primary" style={{ fontSize:15,padding:'14px 28px' }} onClick={() => uploadRef.current?.scrollIntoView({ behavior:'smooth' })}>
              Analyze My Skills →
            </button>
            <button className="btn btn-ghost" style={{ fontSize:15,padding:'14px 28px' }} onClick={() => navigate('/demo')}>
              ▶ Watch Demo
            </button>
          </div>
          {/* Stats */}
          <div className="fade-up-4" style={{ display:'flex',gap:24,flexWrap:'wrap' }}>
            {[['10,000+','Paths Generated'],['38','Job Domains'],['94%','Accuracy']].map(([n,l]) => (
              <div key={l} style={{ fontSize:13 }}>
                <span style={{ fontWeight:700,color:'#F9FAFB',fontSize:15 }}>{n} </span>
                <span style={{ color:'#6B7280' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero preview card */}
        <div className="fade-up-2 float" style={{ flex:1,zIndex:1,display:'flex',justifyContent:'center' }}>
          <div style={{
            background:'#111827',border:'1px solid #1F2D45',borderRadius:20,
            padding:24,width:340,
            transform:'perspective(900px) rotateY(-8deg) rotateX(3deg)',
            boxShadow:'0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,110,247,0.1)',
          }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
              <span style={{ fontSize:13,fontWeight:700 }}>Onboarding Dashboard</span>
              <span style={{ fontSize:11,background:'rgba(16,185,129,0.15)',color:'#10B981',padding:'2px 8px',borderRadius:10 }}>Live</span>
            </div>
            {/* Coverage bar */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:11,color:'#6B7280',marginBottom:5 }}><span>Skill Coverage</span><span>62%</span></div>
              <div style={{ height:6,background:'#1A2235',borderRadius:3,overflow:'hidden' }}>
                <div style={{ height:'100%',width:'62%',background:'#4F6EF7',borderRadius:3,boxShadow:'0 0 8px rgba(79,110,247,0.5)' }} />
              </div>
            </div>
            {/* Gap pills */}
            <div style={{ fontSize:11,color:'#6B7280',marginBottom:6 }}>Critical gaps</div>
            <div style={{ display:'flex',flexWrap:'wrap',gap:5,marginBottom:14 }}>
              {['Machine Learning','Deep Learning','Docker','NLP'].map((t,i) => (
                <span key={t} style={{ fontSize:11,padding:'3px 9px',borderRadius:10,background:i<2?'rgba(239,68,68,0.12)':'rgba(245,158,11,0.12)',color:i<2?'#F87171':'#FCD34D',border:i<2?'1px solid rgba(239,68,68,0.2)':'1px solid rgba(245,158,11,0.2)' }}>{t}</span>
              ))}
            </div>
            {/* Mini nodes */}
            <div style={{ fontSize:11,color:'#6B7280',marginBottom:8 }}>Skill graph preview</div>
            <div style={{ background:'#0d1421',borderRadius:8,padding:12,height:72,position:'relative' }}>
              {[{l:'Python',x:10,y:14,c:'#10B981'},{l:'ML',x:88,y:6,c:'#EF4444'},{l:'SQL',x:88,y:36,c:'#4F6EF7'},{l:'DL',x:166,y:20,c:'#EF4444'},{l:'NLP',x:230,y:8,c:'#EF4444'}].map(n => (
                <div key={n.l} style={{ position:'absolute',left:n.x,top:n.y,width:38,height:38,borderRadius:'50%',background:n.c+'1a',border:'1.5px solid '+n.c,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:n.c,boxShadow:n.c==='#EF4444'?'0 0 8px rgba(239,68,68,0.3)':'none' }}>{n.l}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section style={{ padding:'40px 48px',borderTop:'1px solid #1F2D45',borderBottom:'1px solid #1F2D45',display:'flex',justifyContent:'space-around',flexWrap:'wrap',gap:24 }}>
        {[['10K+','Learning paths generated'],['38','Job domains covered'],['94%','Skill extraction accuracy'],['3x','Faster time to competency']].map(([n,l]) => (
          <div key={l} style={{ textAlign:'center' }}>
            <div style={{ fontSize:36,fontWeight:800,color:'#4F6EF7',letterSpacing:'-0.03em' }}>{n}</div>
            <div style={{ fontSize:13,color:'#6B7280',marginTop:4 }}>{l}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding:'80px 48px' }}>
        <div style={{ textAlign:'center',marginBottom:56 }}>
          <div style={{ fontSize:12,fontWeight:600,color:'#4F6EF7',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:10 }}>Process</div>
          <h2 style={{ fontSize:36,fontWeight:800,marginBottom:10,letterSpacing:'-0.02em' }}>How it works</h2>
          <p style={{ fontSize:15,color:'#6B7280' }}>Three steps from upload to personalized learning path</p>
        </div>
        <div style={{ display:'flex',gap:0,position:'relative',maxWidth:900,margin:'0 auto' }}>
          {[
            { n:'1', title:'Upload your documents', desc:'Drop your resume and job description. We parse skills, experience, and requirements automatically.' },
            { n:'2', title:'AI analyzes your gaps', desc:'Semantic matching identifies what you know vs what the role needs. Confidence scoring adds depth.' },
            { n:'3', title:'Get your learning path', desc:'Receive an ordered curriculum mapped to your exact gaps — prerequisite-aware, nothing redundant.' },
          ].map((s,i) => (
            <div key={i} style={{ flex:1,textAlign:'center',padding:'0 24px',position:'relative' }}>
              {i < 2 && <div style={{ position:'absolute',top:32,left:'55%',width:'50%',borderTop:'1px dashed #1F2D45' }} />}
              <div style={{ width:56,height:56,borderRadius:16,background:'rgba(79,110,247,0.1)',border:'1px solid rgba(79,110,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:800,color:'#4F6EF7',margin:'0 auto 18px',position:'relative',zIndex:1 }}>{s.n}</div>
              <div style={{ fontSize:16,fontWeight:700,marginBottom:10 }}>{s.title}</div>
              <div style={{ fontSize:14,color:'#6B7280',lineHeight:1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding:'0 48px 80px' }}>
        <div style={{ textAlign:'center',marginBottom:48 }}>
          <div style={{ fontSize:12,fontWeight:600,color:'#4F6EF7',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:10 }}>Capabilities</div>
          <h2 style={{ fontSize:36,fontWeight:800,letterSpacing:'-0.02em' }}>Everything you need to onboard right</h2>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,maxWidth:1100,margin:'0 auto' }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card-hover hover-glow" style={{ background:'#111827',border:'1px solid #1F2D45',borderRadius:14,padding:'24px' }}>
              <div style={{ width:44,height:44,borderRadius:12,background:f.color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:14 }}>{f.icon}</div>
              <div style={{ fontSize:15,fontWeight:700,marginBottom:8 }}>{f.title}</div>
              <div style={{ fontSize:13,color:'#6B7280',lineHeight:1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:'0 48px 80px' }}>
        <div style={{ textAlign:'center',marginBottom:48 }}>
          <div style={{ fontSize:12,fontWeight:600,color:'#4F6EF7',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:10 }}>Social proof</div>
          <h2 style={{ fontSize:36,fontWeight:800,letterSpacing:'-0.02em' }}>What new hires say</h2>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,maxWidth:1100,margin:'0 auto' }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background:'#111827',border:'1px solid #1F2D45',borderRadius:14,padding:'24px' }}>
              <div style={{ fontSize:13,color:'#9CA3AF',lineHeight:1.8,marginBottom:16,fontStyle:'italic' }}>"{t.text}"</div>
              <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                <div style={{ width:36,height:36,borderRadius:'50%',background:t.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff' }}>
                  {t.name.split(' ').map(w=>w[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize:13,fontWeight:600 }}>{t.name}</div>
                  <div style={{ fontSize:11,color:'#4B5563' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UPLOAD SECTION */}
      <section ref={uploadRef} id="upload" style={{ padding:'80px 48px',background:'#0d1421',borderTop:'1px solid #1F2D45',borderBottom:'1px solid #1F2D45' }}>
        <div style={{ maxWidth:800,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:40 }}>
            <div style={{ fontSize:12,fontWeight:600,color:'#4F6EF7',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:10 }}>Get started</div>
            <h2 style={{ fontSize:36,fontWeight:800,letterSpacing:'-0.02em',marginBottom:10 }}>Ready to find your gaps?</h2>
            <p style={{ fontSize:15,color:'#6B7280' }}>Upload your files — personalized results in under 30 seconds</p>
          </div>
          <div style={{ display:'flex',gap:16,marginBottom:20 }}>
            <DropZone label="Upload Resume" sublabel="Your skills & experience" color="blue" file={resumeFile} onFile={setResumeFile} />
            <DropZone label="Upload Job Description" sublabel="Target role requirements" color="green" file={jdFile} onFile={setJdFile} />
          </div>
          {error && <div style={{ color:'#F87171',fontSize:13,marginBottom:12,textAlign:'center' }}>{error}</div>}
          <button
            className="btn btn-primary"
            style={{ width:'100%',justifyContent:'center',fontSize:16,padding:'16px',borderRadius:12 }}
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? 'Analyzing your skills...' : 'Analyze My Skills →'}
          </button>
          <div style={{ textAlign:'center',fontSize:12,color:'#4B5563',marginTop:12 }}>
            Powered by DeepSeek-R1 · MiniLM-L6-v2 · NetworkX · ChromaDB
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'32px 48px',borderTop:'1px solid #1F2D45',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
        <div>
          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:4 }}>
            <div style={{ width:24,height:24,background:'linear-gradient(135deg,#4F6EF7,#7B94FB)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'#fff' }}>S</div>
            <span style={{ fontSize:14,fontWeight:700 }}>SynapseOnboard</span>
          </div>
          <div style={{ fontSize:12,color:'#4B5563' }}>Built for HackMatrix 2.0 · IIT Patna</div>
        </div>
        <div style={{ display:'flex',gap:24,fontSize:13,color:'#4B5563' }}>
          {['Features','How it works','Demo','Docs','GitHub'].map(l => <span key={l} style={{ cursor:'pointer' }}>{l}</span>)}
        </div>
        <div style={{ fontSize:12,color:'#4B5563' }}>© 2025 SynapseOnboard</div>
      </footer>
    </div>
  )
}
