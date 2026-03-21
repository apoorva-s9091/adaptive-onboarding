import { useNavigate } from 'react-router-dom'

const levelStyle = {
  beginner:     { bg: 'rgba(16,185,129,0.12)',  color: '#34D399' },
  intermediate: { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D' },
  advanced:     { bg: 'rgba(239,68,68,0.12)',  color: '#F87171' },
}

export default function NodeDrawer({ skill, gap, onClose }) {
  const navigate = useNavigate()
  const ls = levelStyle[gap?.difficulty_level] || levelStyle.intermediate

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed',inset:0,zIndex:40,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(2px)' }} />
      <div style={{
        position:'fixed',right:0,top:0,bottom:0,zIndex:50,width:340,
        background:'#0d1421',borderLeft:'1px solid #1F2D45',
        padding:'32px 24px',overflowY:'auto',
        animation:'slideInRight 0.25s ease-out',
      }}>
        <style>{`@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
        <button onClick={onClose} style={{
          position:'absolute',top:16,right:16,background:'#1A2235',
          border:'1px solid #1F2D45',borderRadius:8,width:32,height:32,
          color:'#9CA3AF',fontSize:16,cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'center',
        }}>x</button>
        <div style={{ fontSize:22,fontWeight:800,color:'#F9FAFB',marginBottom:8,textTransform:'capitalize' }}>{skill}</div>
        {gap ? (
          <>
            <div style={{ display:'inline-block',marginBottom:20,fontSize:12,fontWeight:600,background:ls.bg,color:ls.color,borderRadius:10,padding:'3px 12px' }}>
              {gap.difficulty_level} level
            </div>
            <div style={{ display:'flex',gap:10,marginBottom:20 }}>
              <div style={{ flex:1,background:'#1A2235',border:'1px solid #1F2D45',borderRadius:10,padding:'12px 14px' }}>
                <div style={{ fontSize:11,color:'#4B5563',marginBottom:4 }}>Similarity</div>
                <div style={{ fontSize:20,fontWeight:700,color:'#F59E0B' }}>{Math.round((gap.similarity||0)*100)}%</div>
              </div>
              <div style={{ flex:1,background:'#1A2235',border:'1px solid #1F2D45',borderRadius:10,padding:'12px 14px' }}>
                <div style={{ fontSize:11,color:'#4B5563',marginBottom:4 }}>Priority</div>
                <div style={{ fontSize:20,fontWeight:700,color:'#EF4444' }}>{Math.round((gap.priority_score||0)*100)}%</div>
              </div>
            </div>
            <div style={{ background:'#1A2235',border:'1px solid #1F2D45',borderRadius:12,padding:'16px',marginBottom:20 }}>
              <div style={{ fontSize:11,color:'#4B5563',marginBottom:6 }}>Recommended course</div>
              <div style={{ fontSize:13,fontWeight:600,color:'#F9FAFB',lineHeight:1.5 }}>
                {gap.course || skill + ' — ' + gap.difficulty_level + ' course'}
              </div>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              <button className="btn btn-primary" style={{ justifyContent:'center' }} onClick={() => navigate('/quiz/'+encodeURIComponent(skill))}>Take Quiz →</button>
              <button className="btn btn-ghost" style={{ justifyContent:'center' }} onClick={() => navigate('/trace/'+encodeURIComponent(skill))}>View Reasoning</button>
            </div>
          </>
        ) : (
          <div style={{ fontSize:14,color:'#6B7280',marginTop:8 }}>
            This skill is already covered in your resume.
            <div style={{ marginTop:16,display:'inline-block',fontSize:12,padding:'4px 12px',borderRadius:10,background:'rgba(16,185,129,0.12)',color:'#34D399' }}>Covered</div>
          </div>
        )}
      </div>
    </>
  )
}
