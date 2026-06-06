import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: 'italic' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #2DD4BF 0%, #3B82F6 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        textAlign: 'center',
        color: '#FFFFFF',
      }}>
        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.04em' }}>TaskFlow</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 60px)',
          fontWeight: 700,
          margin: '0 0 24px',
          lineHeight: 1.1,
          maxWidth: 700,
        }}>
          Manage your work,<br />beautifully.
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          maxWidth: 520,
          margin: '0 0 48px',
          opacity: 0.9,
          fontWeight: 300,
          lineHeight: 1.6,
        }}>
          TaskFlow brings your projects and tasks together in one calm, focused space.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#FFFFFF',
              color: '#2DD4BF',
              border: 'none',
              padding: '14px 36px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Times New Roman', Times, serif",
              fontStyle: 'italic',
            }}
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              color: '#FFFFFF',
              border: '2px solid rgba(255,255,255,0.8)',
              padding: '14px 36px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Times New Roman', Times, serif",
              fontStyle: 'italic',
            }}
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: '#FFFFFF', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 700,
            color: '#2F3630',
            marginBottom: 60,
          }}>
            Everything you need to stay focused
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 32,
          }}>
            {[
              {
                icon: '📁',
                title: 'Projects',
                desc: 'Organize your work into clear, structured projects with titles, descriptions, and status tracking.',
              },
              {
                icon: '✅',
                title: 'Tasks',
                desc: 'Break work into tasks with priority levels, due dates, and a visual kanban board for clarity.',
              },
              {
                icon: '👥',
                title: 'Team-ready',
                desc: 'Built with collaboration in mind. A clean interface that keeps everyone on the same page.',
              },
            ].map(f => (
              <div key={f.title} style={{
                background: '#FAF8F3',
                border: '1px solid #E7E1D6',
                borderRadius: 16,
                padding: 32,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#2F3630', marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: '#7C8B74', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#FAF8F3',
        borderTop: '1px solid #C2CBBE',
        padding: '32px 24px',
        textAlign: 'center',
        color: '#7C8B74',
        fontSize: 14,
      }}>
        <span style={{ fontWeight: 700, color: '#2F3630' }}>TaskFlow</span> &copy; 2025. All rights reserved.
      </footer>
    </div>
  )
}
