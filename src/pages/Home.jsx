import { Link } from 'react-router-dom'
import { TOPICS, BADGE_VARIANTS } from '../data/topics'

export default function Home() {
  const totalTopics = Object.values(TOPICS).reduce((acc, cat) => acc + cat.topics.length, 0)

  return (
    <div style={{ maxWidth: 860 }}>
      <div className="home-hero">
        <h1>
          Ace Your Next <span className="gradient-text">Frontend Interview</span>
        </h1>
        <p>
          Comprehensive guide to React, TypeScript & JavaScript — covering syntax, patterns,
          real-world examples, and the interview questions that actually get asked.
        </p>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">{Object.keys(TOPICS).length}</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat">
            <div className="stat-num">{totalTopics}</div>
            <div className="stat-label">Topics</div>
          </div>
          <div className="stat">
            <div className="stat-num">40+</div>
            <div className="stat-label">Interview Q&amp;A</div>
          </div>
          <div className="stat">
            <div className="stat-num">30+</div>
            <div className="stat-label">Code Examples</div>
          </div>
        </div>
      </div>

      <div className="category-grid">
        {Object.entries(TOPICS).map(([key, cat]) => (
          <Link key={key} to={cat.topics[0].path} className="category-card">
            <div className="category-card-header">
              <div className="category-icon" style={{ background: cat.bgColor }}>
                {cat.emoji}
              </div>
              <h3>{cat.label}</h3>
            </div>
            <p>{cat.description}</p>
            <ul className="topic-list">
              {cat.topics.map(t => (
                <li key={t.path}>
                  <Link to={t.path}>
                    <span>→</span>
                    <span>{t.label}</span>
                  </Link>
                  <span className={`badge ${BADGE_VARIANTS[t.badge]}`}>{t.badge}</span>
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>

      <div className="section">
        <div className="section-title">🔥 Why this guide?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 14 }}>
          {[
            { icon: '📖', title: 'Concept + Syntax', desc: 'Clear explanations with precise syntax references you can rely on.' },
            { icon: '💡', title: 'MVP Examples', desc: 'Minimal runnable examples that isolate the core idea.' },
            { icon: '🌐', title: 'Real-World Patterns', desc: 'Production code patterns used in actual applications.' },
            { icon: '❓', title: 'Interview Q&A', desc: 'The questions interviewers actually ask, with thorough answers.' },
          ].map(item => (
            <div key={item.title} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '16px',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontWeight: 600, color: 'var(--text-heading)', marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="callout callout-orange">
        <strong>💡 Tip:</strong> Use the sidebar to navigate between topics.
        Each page has 4 tabs: <strong>Overview</strong>, <strong>Syntax & Examples</strong>, <strong>Real-World</strong>, and <strong>Interview Q&A</strong>.
      </div>
    </div>
  )
}
