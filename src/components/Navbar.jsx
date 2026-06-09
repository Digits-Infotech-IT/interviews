import { NavLink } from 'react-router-dom'
import { TOPICS } from '../data/topics'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        <div className="navbar-logo-icon">🎯</div>
        <span className="navbar-logo-text">Dev<span>Prep</span></span>
      </NavLink>

      <div className="navbar-nav">
        {Object.entries(TOPICS).map(([key, config]) => (
          <NavLink
            key={key}
            to={`/${key}/${config.topics[0].path.split('/').pop()}`}
            className={({ isActive }) => {
              const pathKey = window.location.pathname.split('/')[1]
              return `nav-link${pathKey === key ? ' active' : ''}`
            }}
          >
            <span className="nav-link-emoji">{config.emoji}</span>
            {config.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
