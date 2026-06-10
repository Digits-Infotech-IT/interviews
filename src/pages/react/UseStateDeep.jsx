import TopicPage from '../../components/TopicPage'
import CodeBlock from '../../components/CodeBlock'

const CODE_ORIGINAL = `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [newcount, setNewCount] = useState(0);

  function counting() {
    setCount((prev) => prev + 1);
    setNewCount((prev) => prev + 1);
    console.log(\`count: \${count}, newcount: \${newcount}\`);
    //            ^^^^^ logs OLD value — why?
  }

  return (
    <div>
      <button onClick={counting}>
        count {count} - New Count {newcount}
      </button>
    </div>
  );
}`

// ─── Chat bubble helper components ───────────────────────────────────────────

function ChatCode({ code }) {
  return (
    <pre style={{
      background: '#0D0E17',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8,
      padding: '12px 14px',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.8rem',
      lineHeight: 1.65,
      color: '#C0CAF5',
      overflowX: 'auto',
      margin: '10px 0 4px',
      whiteSpace: 'pre',
    }}>{code}</pre>
  )
}

function Ic({ children }) {
  return (
    <code style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.82em',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 4,
      padding: '1px 5px',
      color: 'var(--primary)',
    }}>{children}</code>
  )
}

function UserMsg({ children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: 'row-reverse', maxWidth: '80%' }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.62rem', fontWeight: 700, color: 'white', flexShrink: 0,
          letterSpacing: '0.4px',
        }}>YOU</div>
        <div style={{
          background: 'rgba(249,115,22,0.07)',
          border: '1px solid rgba(249,115,22,0.28)',
          borderRadius: '12px 3px 12px 12px',
          padding: '12px 16px',
          fontSize: '0.875rem',
          lineHeight: 1.7,
          color: 'var(--text)',
        }}>{children}</div>
      </div>
    </div>
  )
}

function AiMsg({ children }) {
  return (
    <div style={{ display: 'flex', marginBottom: 18, gap: 10, alignItems: 'flex-start' }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7C3AED, #4C1D95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.62rem', fontWeight: 700, color: 'white', flexShrink: 0,
        letterSpacing: '0.4px',
      }}>AI</div>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '3px 12px 12px 12px',
        padding: '14px 18px',
        fontSize: '0.875rem',
        lineHeight: 1.7,
        color: 'var(--text)',
        flex: 1,
      }}>{children}</div>
    </div>
  )
}

function H({ children }) {
  return (
    <p style={{ fontWeight: 600, color: 'var(--text-heading)', margin: '14px 0 5px', fontSize: '0.875rem' }}>
      {children}
    </p>
  )
}

function P({ children, style }) {
  return <p style={{ margin: '5px 0', fontSize: '0.875rem', lineHeight: 1.7, ...style }}>{children}</p>
}

function Ul({ items }) {
  return (
    <ul style={{ margin: '6px 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map((item, i) => <li key={i} style={{ fontSize: '0.875rem' }}>{item}</li>)}
    </ul>
  )
}

function Note({ children }) {
  return (
    <div style={{
      background: 'rgba(249,115,22,0.06)',
      borderLeft: '3px solid var(--primary)',
      borderRadius: '0 6px 6px 0',
      padding: '9px 14px',
      fontSize: '0.85rem',
      color: 'var(--text)',
      margin: '10px 0',
      lineHeight: 1.65,
    }}>{children}</div>
  )
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '14px 0' }} />
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div>
      <div className="callout callout-orange">
        <strong>The question:</strong> Why does <code>console.log(count)</code> show the <em>old</em> value
        right after calling <code>setCount</code> in the same function?
      </div>

      <div className="section">
        <div className="section-title">🧪 The Code That Raised the Question</div>
        <CodeBlock code={CODE_ORIGINAL} language="jsx" title="App.jsx — counting() logs stale count" />
      </div>

      <div className="section">
        <div className="section-title">💡 Three Core Concepts to Understand</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            {
              icon: '📸',
              title: 'State is a Snapshot',
              desc: 'Each render captures a fixed snapshot of all state values. Inside a single render cycle, count is frozen at the value it had when rendering began — it cannot change mid-function.',
            },
            {
              icon: '⏳',
              title: 'setState is Asynchronous / Batched',
              desc: 'Calling setCount() does not change count immediately. It schedules a re-render. The actual state update happens after the entire event handler returns.',
            },
            {
              icon: '🔁',
              title: 'Re-render brings the new value',
              desc: 'Only after React finishes processing the event and re-renders the component will count reflect the new value — and the UI will update.',
            },
          ].map(item => (
            <div key={item.title} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '14px 16px',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: 4, fontSize: '0.9rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChatTab() {
  return (
    <div>
      <div style={{ marginBottom: 16, fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>💬</span> Real AI chat session — exploring useState behavior step by step
      </div>

      <div style={{
        background: 'var(--bg-sidebar)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '24px 20px',
      }}>

        {/* ── Turn 1 ── */}
        <UserMsg>
          When I click the count button, the button count showed incremented value, but the console
          shows <Ic>count: 0</Ic> — why?
          <br /><br />
          We have done both <Ic>setCount</Ic> and <Ic>console.log(count)</Ic> in the same{' '}
          <Ic>counting()</Ic> function — then why does the console not show 1?
          When does the increment happen? What process internally?
        </UserMsg>

        <AiMsg>
          <P>Because in React, <Ic>setCount(...)</Ic> does <strong>not</strong> update <Ic>count</Ic> immediately.</P>

          <H>What is happening</H>
          <P>Inside <Ic>counting()</Ic>:</P>
          <ChatCode code={`setCount((prev) => prev + 1);\nconsole.log(count);`} />
          <Ul items={[
            'setCount schedules a state update',
            'count in that same function is still the old value',
            'so console.log(count) prints 0',
          ]} />

          <H>Why the button shows 1</H>
          <P>React updates state <strong>after</strong> the event handler finishes, then re-renders the component with the new value.</P>

          <H>So the process is:</H>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '8px 0' }}>
            {[
              { text: '1.  Click button', highlight: false },
              { text: '2.  counting() runs', highlight: false },
              { text: '3.  setCount(prev => prev + 1)  →  update queued', highlight: false },
              { text: '4.  console.log(count)  →  still old count  ← why 0!', highlight: true },
              { text: '5.  counting() returns', highlight: false },
              { text: '6.  React re-renders', highlight: false },
              { text: '7.  UI shows count = 1', highlight: false },
            ].map((step, i) => (
              <div key={i} style={{
                padding: '7px 12px',
                background: step.highlight ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${step.highlight ? 'rgba(249,115,22,0.35)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: step.highlight ? 'var(--primary)' : 'var(--text)',
                fontWeight: step.highlight ? 600 : 400,
              }}>{step.text}</div>
            ))}
          </div>

          <Divider />

          <Note>
            <strong>Internal idea:</strong> State in React is like a <strong>snapshot</strong>.
            Each render gets its own fixed value of <Ic>count</Ic>.
            So inside one render cycle, <Ic>count</Ic> cannot change.
          </Note>

          <H>If you want to log the updated value</H>
          <P>Use <Ic>useEffect</Ic>:</P>
          <ChatCode code={`useEffect(() => {\n  console.log(count);\n}, [count]);`} />
          <P style={{ marginTop: 8 }}>This runs <em>after</em> count changes and the component re-renders.</P>

          <Divider />
          <P><strong>In short:</strong></P>
          <Ul items={[
            'setCount updates state async / batched',
            'console.log(count) inside the same function sees the old value',
            'the increment happens after the handler, during re-render',
          ]} />
        </AiMsg>

        {/* ── Turn 2 ── */}
        <UserMsg>
          Please show this with a very simple step-by-step timeline diagram.
        </UserMsg>

        <AiMsg>
          <P>Here's a simple timeline:</P>
          <ChatCode code={
`Initial render
count = 0

Click button
  |
  v
counting() starts
  |
  +--> setCount(prev => prev + 1)  // update is queued
  |
  +--> console.log(count)          // still 0 here
  |
  v
counting() ends
  |
  v
React re-renders component
  |
  v
count = 1
button shows 1`} />

          <H>Key idea</H>
          <Ul items={[
            <><Ic>setCount(...)</Ic> queues the update</>,
            <><Ic>count</Ic> inside the same function is still the old snapshot</>,
            'React updates the UI after the function finishes',
          ]} />

          <H>Even simpler example</H>
          <ChatCode code={`function counting() {\n  setCount((prev) => prev + 1);\n  console.log(count); // old value\n}`} />
          <P>If count was 0, console shows <Ic>0</Ic>, and after re-render the button shows <Ic>1</Ic>.</P>
        </AiMsg>

        {/* ── Turn 3 ── */}
        <UserMsg>
          Yes — show the same timeline for <Ic>setCount(count + 1)</Ic> vs <Ic>setCount(prev =&gt; prev + 1)</Ic>
        </UserMsg>

        <AiMsg>
          <P>Here's the difference in a simple timeline.</P>

          <H>1)  setCount(count + 1)</H>
          <ChatCode code={
`Render starts
count = 0

Click button
  |
  v
counting() runs
  |
  +--> count + 1 is calculated using current count = 0
  |
  +--> setCount(1) is queued
  |
  +--> console.log(count) => 0
  |
  v
React re-renders
  |
  v
count = 1`} />
          <Note>
            <strong>Problem:</strong> If you call <Ic>setCount(count + 1)</Ic> multiple times in one
            function, every call reads the same stale <Ic>count</Ic>. You'd expect count to reach 3
            after three calls, but it only reaches 1.
          </Note>

          <H>2)  setCount(prev =&gt; prev + 1)</H>
          <ChatCode code={
`Render starts
count = 0

Click button
  |
  v
counting() runs
  |
  +--> React gives latest queued value as prev = 0
  |
  +--> callback returns 1
  |
  +--> update is queued
  |
  +--> console.log(count) => 0  (same — still old snapshot)
  |
  v
React re-renders
  |
  v
count = 1`} />
          <P>React always uses the <strong>latest queued state</strong> as <Ic>prev</Ic>, so multiple calls chain correctly.</P>

          <H>Main difference</H>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '10px 0' }}>
            <div style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8,
              padding: '13px 15px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#F87171', fontWeight: 600, marginBottom: 6 }}>
                setCount(count + 1)
              </div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text)' }}>
                Reads count from current render — can be <strong>stale</strong> when called multiple times
              </div>
            </div>
            <div style={{
              background: 'rgba(52,211,153,0.06)',
              border: '1px solid rgba(52,211,153,0.3)',
              borderRadius: 8,
              padding: '13px 15px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#34D399', fontWeight: 600, marginBottom: 6 }}>
                setCount(prev =&gt; prev + 1)
              </div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text)' }}>
                Gets latest queued state as <Ic>prev</Ic> — always <strong>safe</strong>
              </div>
            </div>
          </div>

          <P>For a single click both look the same in the UI, but the <Ic>prev</Ic> form is more reliable — use it whenever new state depends on previous state.</P>
        </AiMsg>

        {/* ── Turn 4 ── */}
        <UserMsg>
          Can you show why <Ic>setCount(count + 1)</Ic> can fail when called twice in the same function?
        </UserMsg>

        <AiMsg>
          <P>Yes — here's the reason in a simple way.</P>

          <H>Example with setCount(count + 1)</H>
          <ChatCode code={`function counting() {\n  setCount(count + 1);\n  setCount(count + 1);\n}`} />
          <P>Suppose <Ic>count = 0</Ic>. What happens:</P>
          <Ul items={[
            <><strong>First line:</strong> <Ic>setCount(count + 1)</Ic> → <Ic>setCount(1)</Ic></>,
            <><strong>Second line:</strong> <Ic>setCount(count + 1)</Ic> → still <Ic>setCount(1)</Ic></>,
            <>Why? Both lines read the same old <Ic>count</Ic> value from the current render.</>,
          ]} />

          <H>Timeline</H>
          <ChatCode code={
`Render:
count = 0

Click button
  |
  v
counting() runs
  |
  +--> setCount(1)   ← count + 1 = 0 + 1
  |
  +--> setCount(1)   ← count + 1 = 0 + 1  (same stale count!)
  |
  v
React batches updates
  |
  v
Final count = 1   ← called twice but only incremented once!`} />

          <Note>
            Even though you called <Ic>setCount</Ic> twice, the final value becomes <strong>1</strong>, not 2,
            because both calls used the same stale snapshot of <Ic>count</Ic>.
          </Note>

          <Divider />

          <H>Now with setCount(prev =&gt; prev + 1)</H>
          <ChatCode code={`function counting() {\n  setCount((prev) => prev + 1);\n  setCount((prev) => prev + 1);\n}`} />
          <P>Suppose <Ic>count = 0</Ic>. What happens:</P>
          <Ul items={[
            <><strong>First update:</strong> gets <Ic>prev = 0</Ic> → returns <Ic>1</Ic></>,
            <><strong>Second update:</strong> gets latest <Ic>prev = 1</Ic> → returns <Ic>2</Ic></>,
          ]} />

          <H>Timeline</H>
          <ChatCode code={
`Render:
count = 0

Click button
  |
  v
counting() runs
  |
  +--> prev = 0  →  returns 1   (queued)
  |
  +--> prev = 1  →  returns 2   (queued, uses previous result)
  |
  v
React batches updates
  |
  v
Final count = 2   ← correctly incremented twice`} />

          <Divider />

          <H>Main reason</H>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '10px 0' }}>
            <div style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8,
              padding: '13px 15px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#F87171', fontWeight: 600, marginBottom: 6 }}>
                setCount(count + 1)
              </div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text)' }}>
                Uses the <strong>old snapshot</strong> — every call in the same function reads the same stale value
              </div>
            </div>
            <div style={{
              background: 'rgba(52,211,153,0.06)',
              border: '1px solid rgba(52,211,153,0.3)',
              borderRadius: 8,
              padding: '13px 15px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#34D399', fontWeight: 600, marginBottom: 6 }}>
                setCount(prev =&gt; prev + 1)
              </div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text)' }}>
                Uses the <strong>latest queued state</strong> — each call chains off the previous result
              </div>
            </div>
          </div>
        </AiMsg>

      </div>
    </div>
  )
}

const QA = [
  {
    q: 'Why does console.log(count) show the old value right after calling setCount?',
    a: `React state is a snapshot per render. When setCount is called, it queues a state update but does NOT modify the count variable in the current function. console.log runs in the same render cycle, so it still sees the old value.
The updated value only becomes available in the next render.`,
  },
  {
    q: 'What is the difference between setCount(count + 1) and setCount(prev => prev + 1)?',
    a: `setCount(count + 1) captures the count value from the current render. If called multiple times in one cycle, every call reads the same stale count — so only one increment applies.

setCount(prev => prev + 1) uses a functional update. React passes the most recently queued state as prev, so multiple calls chain correctly.

Rule: always use the functional form when new state depends on previous state.`,
  },
  {
    q: 'How can you log the updated state value after a setState call?',
    a: `Use useEffect with the state variable as a dependency:

useEffect(() => {
  console.log(count); // runs after each render where count changed
}, [count]);

This fires after the component re-renders with the new state, so you see the updated value.`,
  },
  {
    q: 'What does "React state is a snapshot" mean?',
    a: `In any given render, all state values are frozen — they reflect the state at the time React called your component function. Even if you call setState multiple times inside an event handler, the local variables never change during that call. They are like a photograph taken at the start of that render.

This is why setCount() + console.log(count) in the same function always shows the old count.`,
  },
  {
    q: 'When is state actually updated in React?',
    a: `State is updated after the event handler (or async callback) finishes executing. React batches all setState calls from a single event handler and applies them in a single re-render.
In React 18+, automatic batching was extended to async code (setTimeout, fetch callbacks) as well.`,
  },
]

function QATab() {
  return (
    <div className="qa-list">
      {QA.map((item, i) => (
        <div key={i} className="qa-item">
          <div className="qa-question">
            <span className="qa-q-icon">Q</span>
            {item.q}
          </div>
          <div className="qa-answer" style={{ whiteSpace: 'pre-line' }}>{item.a}</div>
        </div>
      ))}
    </div>
  )
}

export default function UseStateDeep() {
  return (
    <TopicPage
      title="useState — State Update Process"
      emoji="🔄"
      description="Why setCount doesn't update count immediately, how React batches updates, and the difference between direct vs functional state updates."
      difficulty="Core"
      tabs={[
        { id: 'overview', label: 'Overview', icon: '📖', content: <OverviewTab /> },
        { id: 'chat', label: 'Chat Session', icon: '💬', content: <ChatTab /> },
        { id: 'qa', label: 'Interview Q&A', icon: '❓', content: <QATab /> },
      ]}
    />
  )
}
