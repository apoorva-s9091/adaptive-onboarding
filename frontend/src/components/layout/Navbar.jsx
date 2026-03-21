import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Demo', href: '/demo' },
    { label: 'Docs', href: '/docs' },
  ]

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 48px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,15,30,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(31,45,69,0.8)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, #4F6EF7, #7B94FB)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#fff',
          boxShadow: '0 0 16px rgba(79,110,247,0.4)',
        }}>S</div>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#F9FAFB', letterSpacing: '-0.02em' }}>
          SynapseOnboard
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 32 }}>
        {links.map(l => (
          l.href.startsWith('/') ? (
            <Link
              key={l.label}
              to={l.href}
              style={{
                fontSize: 14, color: location.pathname === l.href ? '#F9FAFB' : '#9CA3AF',
                textDecoration: 'none',
                transition: 'color 0.2s',
                fontWeight: location.pathname === l.href ? 600 : 400,
              }}
              onMouseEnter={e => e.target.style.color = '#F9FAFB'}
              onMouseLeave={e => e.target.style.color = location.pathname === l.href ? '#F9FAFB' : '#9CA3AF'}
            >{l.label}</Link>
          ) : (
            <a
              key={l.label}
              href={l.href}
              style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#F9FAFB'}
              onMouseLeave={e => e.target.style.color = '#9CA3AF'}
            >{l.label}</a>
          )
        ))}
      </div>

      {/* Right buttons */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>
          Sign in
        </button>
        <Link to="/#upload">
          <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
            Get Started →
          </button>
        </Link>
      </div>
    </nav>
  )
}
