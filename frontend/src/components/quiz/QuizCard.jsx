import { useState } from 'react'

export default function QuizCard({ question, index, total, onAnswer, submitted }) {
  const [selected, setSelected] = useState(null)

  const optionStyle = (opt) => {
    const letter = opt.charAt(0)
    if (submitted && letter === question.answer) return { bg:'rgba(16,185,129,0.15)',border:'#10B981',color:'#34D399' }
    if (submitted && selected === letter) return { bg:'rgba(239,68,68,0.15)',border:'#EF4444',color:'#F87171' }
    if (selected === letter) return { bg:'rgba(79,110,247,0.15)',border:'#4F6EF7',color:'#7B94FB' }
    return { bg:'transparent',border:'#1F2D45',color:'#9CA3AF' }
  }

  return (
    <div style={{ maxWidth:680,margin:'0 auto' }}>
      <div style={{ fontSize:12,color:'#4B5563',marginBottom:12,fontWeight:500 }}>Question {index+1} of {total}</div>
      <div style={{ fontSize:18,fontWeight:700,color:'#F9FAFB',lineHeight:1.5,marginBottom:28 }}>{question.question}</div>
      <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
        {question.options?.map((opt,i) => {
          const letter = opt.charAt(0)
          const s = optionStyle(opt)
          return (
            <button key={i} onClick={() => { if (!submitted) { setSelected(letter); onAnswer(letter) } }}
              style={{
                width:'100%',padding:'14px 20px',borderRadius:10,
                cursor:submitted?'default':'pointer',
                background:s.bg,border:'1px solid '+s.border,
                color:s.color,fontSize:14,fontWeight:500,
                textAlign:'left',fontFamily:'Syne',
                transition:'all 0.15s ease',
                display:'flex',alignItems:'center',gap:12,
              }}>
              <span style={{
                width:28,height:28,borderRadius:7,flexShrink:0,
                display:'flex',alignItems:'center',justifyContent:'center',
                background:s.bg||'rgba(255,255,255,0.05)',
                border:'1px solid '+s.border,
                fontSize:12,fontWeight:700,
              }}>{letter}</span>
              {opt.slice(2).trim()}
              {submitted && letter===question.answer && <span style={{marginLeft:'auto',color:'#10B981',fontSize:16}}>done</span>}
              {submitted && selected===letter && letter!==question.answer && <span style={{marginLeft:'auto',color:'#EF4444',fontSize:16}}>X</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
