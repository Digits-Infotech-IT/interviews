import { useState } from 'react'

export default function CodeBlock({ code, language = 'jsx', title }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-lang">{title || language}</span>
        <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
          {copied ? '✓ Copied!' : '⎘ Copy'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  )
}
