import { useEffect, useState } from 'react'

export default function TracePanel({ reasoning='', loading=false }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!reasoning) return
    setDisplayed(''); setDone(false)
    let i = 0
    const iv = setInterval(() => {
      setDisplayed(reasoning.slice(0, i)); i++
      if (i > reasoning.length) { clearInterval(iv); setDone(true) }
    }, 18)
    return () => clearInterval(iv)
  }, [reasoning])

  const m = displayed.match(/Reasoning:([\s\S]*?)Recommendation:([\s\S]*)/)
  const thinkText = m ? m[1].trim() : ''
  const recText = m ? m[2].trim() : displayed

  return (
    <div style={{ background:'#0d1421',border:'1px solid #1F2D45',borderLeft:'3px solid #4F6EF7',borderRadius:14,padding:'24px' }}>
      <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:20 }}>
        <div style={{ width:32,height:32,borderRadius:8,background:'rgba(79,110,247,0.12)',border:'1px solid rgba(79,110,247,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14 }}>AI</div>
        <div>
          <div style={{ fontSize:13,fontWeight:700,color:'#F9FAFB' }}>AI Reasoning</div>
          <div style={{ fontSize:11,color:'#4B5563' }}>Powered by DeepSeek-R1</div>
        </div>
        {loading && <div style={{ marginLeft:'auto',display:'flex',gap:4 }}>
          {[0,1,2].map(i => <div key={i} style={{ width:6,height:6,borderRadius:'50%',background:'#4F6EF7',animation:'bounce 1s '+i*0.15+'s infinite' }} />)}
          <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
        </div>}
      </div>
      {loading ? <div style={{ color:'#4B5563',fontSize:14,fontStyle:'italic' }}>Generating reasoning trace...</div> : (
        <>
          {thinkText && (
            <div style={{ background:'rgba(255,255,255,0.02)',border:'1px solid #1F2D45',borderRadius:8,padding:'14px 16px',marginBottom:16 }}>
              <div style={{ fontSize:11,color:'#4B5563',marginBottom:6,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase' }}>Thinking process</div>
              <div style={{ fontFamily:'"JetBrains Mono",monospace',fontSize:13,color:'#6B7280',lineHeight:1.7,fontStyle:'italic' }}>{thinkText}</div>
            </div>
          )}
          <div style={{ fontSize:14,color:'#D1D5DB',lineHeight:1.8 }}>
            {recText}
            {!done && <span style={{ color:'#4F6EF7',animation:'blink 0.7s infinite' }}>|</span>}
          </div>
        </>
      )}
    </div>
  )
}
