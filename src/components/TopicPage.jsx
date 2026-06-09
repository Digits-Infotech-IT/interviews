import { useState } from 'react'
import { BADGE_VARIANTS } from '../data/topics'

export default function TopicPage({ title, emoji, description, difficulty = 'Essential', tabs }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="topic-page">
      <div className="topic-header">
        <div className="topic-header-top">
          <span className="topic-emoji">{emoji}</span>
          <div>
            <h1 className="topic-title">{title}</h1>
          </div>
          <span className={`badge ${BADGE_VARIANTS[difficulty] || 'badge-essential'}`}>{difficulty}</span>
        </div>
        <p className="topic-description">{description}</p>
      </div>

      <div className="topic-tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tabs[activeTab].content}
      </div>
    </div>
  )
}
