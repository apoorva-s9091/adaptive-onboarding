import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import QuizCard from '../components/quiz/QuizCard'
import { generateQuiz, submitQuiz } from '../api/client'

export default function Quiz() {
  const { skill } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  const data = JSON.parse(sessionStorage.getItem('onboarding_result') || '{}')
  const gap = data.gaps?.find(g => g.skill?.toLowerCase() === skill?.toLowerCase())

  useEffect(() => {
    generateQuiz(skill, gap?.difficulty_level || 'intermediate')
      .then(r => { setQuestions(r.data.questions || []); setLoading(false) })
      .catch(() => {
        setQuestions([{
          question: `What is a key concept in ${skill}?`,
          options: ['A. Fundamentals', 'B. Advanced patterns', 'C. Deployment', 'D. Testing'],
          answer: 'A'
        }])
        setLoading(false)
      })
  }, [skill])

  const handleAnswer = (letter) => {
    const updated = [...answers]
    updated[current] = letter
    setAnswers(updated)
  }

  const handleNext = () => {
    if (current < questions.length - 1) { setCurrent(c => c+1) }
    else handleSubmit()
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    try {
      const r = await submitQuiz({
        skill, level: gap?.difficulty_level || 'intermediate',
        questions, answers,
        years_experience: data.years_experience || 0,
        semantic_similarity: gap?.similarity || 0.5,
        onet_importance: gap?.onet_importance || 0.5,
        priority_score: gap?.priority_score || 0.5,
      })
      setResult(r.data)
    } catch {}
  }

  const score = answers.filter((a,i) => a === questions[i]?.answer).length

  return (
    <div style={{ background:'#0A0F1E',minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:760,margin:'0 auto',padding:'100px 24px 60px' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize:13,color:'#4B5563',marginBottom:24,display:'flex',alignItems:'center',gap:8 }}>
          <span style={{ cursor:'pointer',color:'#4F6EF7' }} onClick={() => navigate('/results')}>Results</span>
          <span>›</span>
          <span style={{ textTransform:'capitalize' }}>Quiz: {skill}</span>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div style={{ height:3,background:'#1F2D45',borderRadius:2,marginBottom:36,overflow:'hidden' }}>
            <div style={{ height:'100%',background:'#4F6EF7',borderRadius:2,transition:'width 0.3s ease',width:`${((current+1)/questions.length)*100}%` }} />
          </div>
        )}

        {loading ? (
          <div style={{ textAlign:'center',color:'#4B5563',padding:'60px 0' }}>Generating quiz questions...</div>
        ) : !submitted ? (
          <>
            <QuizCard question={questions[current]} index={current} total={questions.length} onAnswer={handleAnswer} submitted={false} />
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:32 }}>
              <button className="btn btn-ghost" onClick={() => navigate('/results')}>Back to Results</button>
              <button className="btn btn-primary" onClick={handleNext} disabled={!answers[current]}>
                {current < questions.length-1 ? 'Next Question →' : 'Submit Quiz →'}
              </button>
            </div>
          </>
        ) : (
          /* Score screen */
          <div style={{ textAlign:'center' }}>
            {/* Score ring */}
            <div style={{ marginBottom:28 }}>
              <svg width="140" height="140" viewBox="0 0 140 140" style={{ display:'block',margin:'0 auto' }}>
                <circle cx="70" cy="70" r="56" fill="none" stroke="#1A2235" strokeWidth="10" />
                <circle cx="70" cy="70" r="56" fill="none"
                  stroke={score===questions.length?'#10B981':score>=questions.length/2?'#F59E0B':'#EF4444'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={2*Math.PI*56}
                  strokeDashoffset={2*Math.PI*56*(1-score/questions.length)}
                  style={{ transform:'rotate(-90deg)',transformOrigin:'50% 50%',transition:'stroke-dashoffset 1s ease' }}
                />
                <text x="70" y="65" textAnchor="middle" fill="#F9FAFB" fontSize="28" fontWeight="800" fontFamily="Syne">{score}/{questions.length}</text>
                <text x="70" y="86" textAnchor="middle" fill="#6B7280" fontSize="12" fontFamily="Syne">correct</text>
              </svg>
            </div>

            {result && (
              <div style={{ display:'inline-block',marginBottom:24,fontSize:14,padding:'8px 20px',borderRadius:10,background:'rgba(79,110,247,0.12)',border:'1px solid rgba(79,110,247,0.25)',color:'#7B94FB' }}>
                Level updated to: <strong>{result.updated_level}</strong>
              </div>
            )}

            <h2 style={{ fontSize:24,fontWeight:800,marginBottom:8 }}>Quiz Complete!</h2>
            <p style={{ fontSize:14,color:'#6B7280',marginBottom:32 }}>
              {score === questions.length ? 'Perfect score!' : score >= questions.length/2 ? 'Good job!' : 'Keep practicing!'}
            </p>

            <div style={{ display:'flex',gap:12,justifyContent:'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/trace/'+encodeURIComponent(skill))}>View Reasoning →</button>
              <button className="btn btn-ghost" onClick={() => navigate('/results')}>Back to Results</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
