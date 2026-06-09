import { NavLink } from 'react-router-dom'
import { BADGE_VARIANTS } from '../data/topics'

export default function Sidebar({ title, emoji, topics }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span>{emoji}</span>
        <span className="sidebar-title">{title}</span>
      </div>
      <nav className="sidebar-nav">
        {topics.map(topic => (
          <NavLink
            key={topic.path}
            to={topic.path}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span>{topic.label}</span>
            <span className={`badge ${BADGE_VARIANTS[topic.badge] || 'badge-core'}`}>{topic.badge}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
