import { useState, useRef } from 'react'

export default function DropZone({ label, sublabel, color = 'blue', onFile, file }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const borderColor = color === 'blue' ? '#4F6EF7' : '#10B981'
  const bgColor = color === 'blue' ? 'rgba(79,110,247,0.05)' : 'rgba(16,185,129,0.05)'
  const bgHover = color === 'blue' ? 'rgba(79,110,247,0.1)' : 'rgba(16,185,129,0.1)'
  const iconColor = color === 'blue' ? '#7B94FB' : '#34D399'

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }

  const handleChange = (e) => {
    const f = e.target.files[0]
    if (f) onFile(f)
  }

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        flex: 1,
        border: `2px dashed ${file ? borderColor : dragging ? borderColor : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 16,
        padding: '40px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        background: file ? bgHover : dragging ? bgColor : 'transparent',
        transition: 'all 0.25s ease',
        transform: dragging ? 'scale(1.01)' : 'scale(1)',
        boxShadow: file ? `0 0 24px ${borderColor}33` : 'none',
      }}
    >
      <input ref={inputRef} type="file" accept=".pdf,.docx" onChange={handleChange} style={{ display: 'none' }} />

      {file ? (
        <>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: iconColor, marginBottom: 4 }}>{file.name}</div>
          <div style={{ fontSize: 12, color: '#4B5563' }}>{(file.size / 1024).toFixed(1)} KB · Click to replace</div>
          {/* Floating skill tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 16 }}>
            {['Python', 'SQL', 'Data Analysis', 'ML'].map((tag, i) => (
              <span
                key={tag}
                className="tag-float"
                style={{
                  animationDelay: `${i * 80}ms`,
                  fontSize: 11, padding: '3px 10px', borderRadius: 10,
                  background: bgHover,
                  border: `1px solid ${borderColor}44`,
                  color: iconColor,
                }}
              >{tag}</span>
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: bgColor,
            border: `1px solid ${borderColor}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 24,
          }}>
            {color === 'blue' ? '📄' : '💼'}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#F9FAFB', marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 13, color: '#6B7280' }}>{sublabel}</div>
          <div style={{ fontSize: 12, color: '#4B5563', marginTop: 8 }}>PDF or DOCX · drag & drop or click</div>
        </>
      )}
    </div>
  )
}
