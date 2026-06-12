import TopicPage from '../../components/TopicPage'
import CodeBlock from '../../components/CodeBlock'

// ─── Code samples ─────────────────────────────────────────────────────────────

const CODE_SNAPSHOT_DEMO = `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => {
      setCount(count + 1);
      console.log(count); // ← always prints OLD value
    }}>
      {count}
    </button>
  );
}`

const CODE_WRONG = `const [count, setCount] = useState(0);

// ❌ Expected +2, but gets +1
function handleClick() {
  setCount(count + 1); // count=0  →  queues: SET TO 1
  setCount(count + 1); // count=0  →  queues: SET TO 1  (same!)
}
// React queue: [ 1, 1 ]
// Final count = 1   (not 2!)`

const CODE_RIGHT = `const [count, setCount] = useState(0);

// ✅ Correctly gets +2
function handleClick() {
  setCount(prev => prev + 1); // queues fn1
  setCount(prev => prev + 1); // queues fn2
}
// React processes: fn1(0) → 1, fn2(1) → 2
// Final count = 2`

const CODE_TIMING = `// ❌ Direct value — + runs RIGHT NOW (in JavaScript)
setCount(count + 1);
// JS evaluates:  count + 1 = 0 + 1 = 1   ← happens immediately
// React gets:    setCount(1)              ← a fixed number

// ✅ Functional update — + runs LATER (inside React)
setCount(prev => prev + 1);
// JS evaluates:  stores the function reference   ← no math yet
// React gets:    (prev) => prev + 1              ← a function
// React calls:   fn(latestQueued) for each step  ← math happens here`

// ─── Helper components ────────────────────────────────────────────────────────

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

function Note({ children, type }) {
  const isGreen = type === 'success'
  const isRed = type === 'error'
  const bg = isGreen
    ? 'rgba(52,211,153,0.06)'
    : isRed
    ? 'rgba(239,68,68,0.06)'
    : 'rgba(249,115,22,0.06)'
  const border = isGreen ? '#34D399' : isRed ? '#F87171' : 'var(--primary)'
  return (
    <div style={{
      background: bg,
      borderLeft: `3px solid ${border}`,
      borderRadius: '0 6px 6px 0',
      padding: '10px 14px',
      fontSize: '0.85rem',
      color: 'var(--text)',
      margin: '10px 0',
      lineHeight: 1.65,
    }}>{children}</div>
  )
}

// ─── Step Card + Vertical Flow (Page Render tab) ─────────────────────────────

function StepCard({ number, emoji, title, desc, note, code }) {
  return (
    <div style={{
      display: 'flex',
      gap: 14,
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '16px',
    }}>
      <div style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: 'rgba(249,115,22,0.12)',
        border: '1px solid rgba(249,115,22,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.78rem',
        fontWeight: 700,
        color: 'var(--primary)',
        flexShrink: 0,
        marginTop: 2,
      }}>{number}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
          <span style={{ fontSize: '1.05rem' }}>{emoji}</span>
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-heading)' }}>{title}</span>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
        {note && (
          <div style={{
            marginTop: 9,
            background: 'rgba(249,115,22,0.06)',
            borderLeft: '3px solid var(--primary)',
            borderRadius: '0 6px 6px 0',
            padding: '7px 12px',
            fontSize: '0.8rem',
            color: 'var(--text)',
            lineHeight: 1.6,
          }}>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>👉 </span>{note}
          </div>
        )}
        {code && (
          <pre style={{
            marginTop: 9,
            background: '#0D0E17',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 7,
            padding: '10px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: '#C0CAF5',
            overflowX: 'auto',
            lineHeight: 1.65,
            whiteSpace: 'pre',
            margin: '9px 0 0',
          }}>{code}</pre>
        )}
      </div>
    </div>
  )
}

function VerticalFlow({ steps }) {
  const items = []
  steps.forEach((step, i) => {
    items.push(
      <div key={`s${i}`} style={{
        background: step.highlight ? 'rgba(249,115,22,0.10)' : 'var(--bg-card)',
        border: `1px solid ${step.highlight ? 'rgba(249,115,22,0.45)' : 'var(--border)'}`,
        borderRadius: 8,
        padding: '10px 16px',
        textAlign: 'center',
        fontSize: '0.84rem',
        fontWeight: step.highlight ? 600 : 400,
        color: step.highlight ? 'var(--primary)' : 'var(--text)',
      }}>{step.text}</div>
    )
    if (i < steps.length - 1) {
      items.push(
        <div key={`a${i}`} style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          padding: '4px 0',
          fontSize: '1.1rem',
        }}>↓</div>
      )
    }
  })
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      maxWidth: 400,
      margin: '0 auto',
    }}>
      {items}
    </div>
  )
}

// ─── Render Cycle Flow Diagram ────────────────────────────────────────────────

function FlowStep({ label, sub, highlight }) {
  return (
    <div style={{
      background: highlight ? 'rgba(249,115,22,0.12)' : 'var(--bg-card)',
      border: `1px solid ${highlight ? 'rgba(249,115,22,0.5)' : 'var(--border)'}`,
      borderRadius: 8,
      padding: '10px 14px',
      textAlign: 'center',
      minWidth: 120,
      flexShrink: 0,
    }}>
      <div style={{
        fontSize: '0.8rem',
        fontWeight: 600,
        color: highlight ? 'var(--primary)' : 'var(--text-heading)',
        lineHeight: 1.4,
      }}>{label}</div>
      {sub && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function FlowRow({ steps }) {
  const items = []
  steps.forEach((step, i) => {
    items.push(<FlowStep key={`s${i}`} {...step} />)
    if (i < steps.length - 1) {
      items.push(
        <span key={`a${i}`} style={{
          color: 'var(--text-muted)',
          fontSize: '1.2rem',
          flexShrink: 0,
          padding: '0 2px',
          userSelect: 'none',
        }}>→</span>
      )
    }
  })
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      overflowX: 'auto',
      padding: '8px 4px 14px',
    }}>
      {items}
    </div>
  )
}

// ─── Lifecycle Phase (Mount / Update / Unmount) ───────────────────────────────

function LifecyclePhase({ phase, color, steps }) {
  const items = []
  steps.forEach((step, i) => {
    items.push(
      <div key={`s${i}`} style={{
        background: step.highlight ? `${color}20` : 'var(--bg-card)',
        border: `1px solid ${step.highlight ? color : 'var(--border)'}`,
        borderRadius: 7,
        padding: '9px 12px',
        textAlign: 'center',
        fontSize: '0.8rem',
        fontWeight: step.highlight ? 600 : 400,
        color: step.highlight ? color : 'var(--text)',
        lineHeight: 1.45,
      }}>{step.text}</div>
    )
    if (i < steps.length - 1) {
      items.push(
        <div key={`a${i}`} style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '1rem',
          lineHeight: 1,
          padding: '3px 0',
        }}>↓</div>
      )
    }
  })
  return (
    <div style={{
      background: 'var(--bg-sidebar)',
      border: `1px solid ${color}55`,
      borderRadius: 10,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        background: `${color}18`,
        borderBottom: `1px solid ${color}40`,
        padding: '9px 16px',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: color,
        letterSpacing: '0.6px',
        fontFamily: 'var(--font-mono)',
      }}>[ {phase} ]</div>
      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items}
      </div>
    </div>
  )
}

// ─── Queue Visualization ──────────────────────────────────────────────────────

function QueueDiagram({ title, isGood, snapshotValue, setCallsCode, queue, processing, finalResult }) {
  const accentColor = isGood ? '#34D399' : '#F87171'
  const accentBg = isGood ? 'rgba(52,211,153,0.06)' : 'rgba(239,68,68,0.06)'
  const accentBorder = isGood ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'

  return (
    <div style={{
      background: 'var(--bg-sidebar)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        color: accentColor,
        fontWeight: 700,
        marginBottom: 14,
      }}>{title}</div>

      {/* Current snapshot */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 7,
        padding: '9px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.82rem',
        color: 'var(--text)',
        lineHeight: 1.6,
        whiteSpace: 'pre',
      }}>{`// current snapshot\ncount = ${snapshotValue}`}</div>

      <div style={{ textAlign: 'center', fontSize: '1.3rem', color: 'var(--text-muted)', padding: '5px 0' }}>↓</div>

      {/* setState calls */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 7,
        padding: '10px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.79rem',
        color: 'var(--text)',
        lineHeight: 1.8,
        whiteSpace: 'pre',
        overflowX: 'auto',
      }}>{setCallsCode}</div>

      <div style={{ textAlign: 'center', fontSize: '1.3rem', color: 'var(--text-muted)', padding: '5px 0' }}>↓</div>

      {/* Queue */}
      <div style={{
        background: accentBg,
        border: `1px solid ${accentBorder}`,
        borderRadius: 7,
        padding: '10px 14px',
      }}>
        <div style={{
          fontSize: '0.72rem',
          color: accentColor,
          fontWeight: 700,
          marginBottom: 7,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.5px',
        }}>REACT UPDATE QUEUE</div>
        {queue.map((item, i) => (
          <div key={i} style={{
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text)',
            padding: '3px 0',
          }}>{i + 1}. {item}</div>
        ))}
      </div>

      {/* Processing steps — functional update only */}
      {processing && (
        <>
          <div style={{ textAlign: 'center', fontSize: '1.3rem', color: 'var(--text-muted)', padding: '5px 0' }}>↓</div>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 7,
            padding: '10px 14px',
          }}>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontWeight: 700,
              marginBottom: 7,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px',
            }}>REACT PROCESSES QUEUE</div>
            {processing.map((step, i) => (
              <div key={i} style={{
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                color: step.highlight ? accentColor : 'var(--text)',
                padding: '3px 0',
                fontWeight: step.highlight ? 600 : 400,
              }}>{step.text}</div>
            ))}
          </div>
        </>
      )}

      <div style={{ textAlign: 'center', fontSize: '1.3rem', color: 'var(--text-muted)', padding: '5px 0' }}>↓</div>

      {/* Result */}
      <div style={{
        background: accentBg,
        border: `1px solid ${accentBorder}`,
        borderRadius: 7,
        padding: '11px 14px',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.88rem',
        fontWeight: 700,
        color: accentColor,
      }}>{finalResult}</div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div>
      <div className="callout callout-orange">
        <strong>Snapshot</strong> = the state values captured at the start of one render —
        they are <strong>frozen</strong> for that entire render. Calling{' '}
        <code>setState()</code> does not change them. A new render creates a fresh snapshot.
      </div>

      {/* Render cycle flow */}
      <div className="section">
        <div className="section-title">🔄 The Render Cycle — How a Snapshot Works</div>
        <FlowRow steps={[
          { label: '📞 React calls your function', sub: 'component function runs' },
          { label: '📸 State values frozen', sub: 'this is the snapshot', highlight: true },
          { label: '🖱️ User event fires', sub: 'e.g. button click' },
          { label: '⌛ setState() called', sub: 'update is queued', highlight: true },
          { label: '🔁 React re-renders', sub: 'component runs again' },
          { label: '✨ New snapshot', sub: 'new state values live here', highlight: true },
        ]} />
        <Note>
          Each render gets its own frozen snapshot. The old snapshot is discarded after
          re-render — React never mutates it.
        </Note>
      </div>

      {/* Full Lifecycle Flow */}
      <div className="section">
        <div className="section-title">🔄 Full Lifecycle Flow</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <LifecyclePhase
            phase="Mount Phase"
            color="#34D399"
            steps={[
              { text: 'Component Created' },
              { text: 'Initial Render (state snapshot)', highlight: true },
              { text: 'DOM Inserted (UI visible)' },
              { text: 'useEffect (runs after mount)', highlight: true },
            ]}
          />
          <LifecyclePhase
            phase="Update Phase"
            color="#F97316"
            steps={[
              { text: 'User Action / Props Change' },
              { text: 'setState called (batched)', highlight: true },
              { text: 'Re-render (new snapshot)', highlight: true },
              { text: 'Virtual DOM Diffing' },
              { text: 'Only Changed DOM Updated' },
              { text: 'useEffect (runs again if deps change)', highlight: true },
            ]}
          />
          <LifecyclePhase
            phase="Unmount Phase"
            color="#F87171"
            steps={[
              { text: 'Condition / Navigation change' },
              { text: 'Component Removed from DOM' },
              { text: 'Cleanup function runs (useEffect return)', highlight: true },
            ]}
          />
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          marginTop: 10,
        }}>
          {[
            { color: '#34D399', text: 'Snapshot created on first render. useEffect has no cleanup yet.' },
            { color: '#F97316', text: 'New snapshot each re-render. Old one is discarded immediately.' },
            { color: '#F87171', text: 'Cleanup from previous useEffect runs before the component leaves.' },
          ].map((item, i) => (
            <div key={i} style={{
              fontSize: '0.77rem',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              padding: '0 2px',
              borderLeft: `2px solid ${item.color}60`,
              paddingLeft: 10,
            }}>{item.text}</div>
          ))}
        </div>
      </div>

      {/* 3 Core Rules */}
      <div className="section">
        <div className="section-title">📌 3 Core Rules</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            {
              icon: '📸',
              title: 'State is a Snapshot',
              desc: 'Each render captures a fixed copy of all state values. Inside one render, count is frozen — it cannot change no matter how many times you call setState().',
              rule: 'Inside one render, state never changes',
            },
            {
              icon: '⌛',
              title: 'setState Queues, Not Changes',
              desc: 'Calling setState() does not update the variable immediately. It schedules a re-render. Your current function still sees the old value.',
              rule: 'setState = "schedule a re-render with new value"',
            },
            {
              icon: '🔁',
              title: 'Re-render Creates a New Snapshot',
              desc: 'Only when React re-renders does the new state value become available — as a brand new snapshot. The old one is discarded.',
              rule: 'New state = new render = new snapshot',
            },
          ].map(item => (
            <div key={item.title} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '16px',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: 5, fontSize: '0.9rem' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.65, marginBottom: 8 }}>
                  {item.desc}
                </div>
                <div style={{
                  background: 'rgba(249,115,22,0.08)',
                  border: '1px solid rgba(249,115,22,0.2)',
                  borderRadius: 5,
                  padding: '5px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--primary)',
                }}>💡 {item.rule}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* See it in action */}
      <div className="section">
        <div className="section-title">🧪 See It in Action</div>
        <CodeBlock code={CODE_SNAPSHOT_DEMO} language="jsx" title="Counter.jsx — console.log shows old value" />
        <Note>
          Even though <Ic>setCount(count + 1)</Ic> is called first, the{' '}
          <Ic>console.log(count)</Ic> right after it still prints the{' '}
          <strong>old</strong> value — because we are still inside the same render's
          frozen snapshot.
        </Note>
      </div>

      {/* Interview definition */}
      <div className="section">
        <div className="section-title">🎯 Interview Definition</div>
        <div style={{
          background: 'rgba(249,115,22,0.08)',
          border: '2px solid rgba(249,115,22,0.35)',
          borderRadius: 10,
          padding: '18px 20px',
        }}>
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            fontWeight: 700,
            marginBottom: 10,
            letterSpacing: '0.8px',
          }}>SAY THIS IN AN INTERVIEW</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.75, fontStyle: 'italic' }}>
            "A snapshot in React is the immutable state and props captured during a single
            render. When state updates, React does not mutate the current snapshot — it
            schedules a re-render that creates a brand new snapshot with the updated values."
          </div>
        </div>
      </div>

      {/* Memory tricks */}
      <div className="section">
        <div className="section-title">🧠 Easy Way to Remember</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: '📸', line: 'Snapshot = frozen photo of state per render' },
            { icon: '⌛', line: 'setState = schedules the next photo, not current' },
            { icon: '🔁', line: 'Re-render = take a new photo with new values' },
            { icon: '🎯', line: 'Same render = same frozen photo, always' },
          ].map(item => (
            <div key={item.line} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 14px',
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.55 }}>{item.line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── How It Works Tab ─────────────────────────────────────────────────────────

function HowItWorksTab() {
  return (
    <div>

      {/* Section 1 — the bug */}
      <div className="section">
        <div className="section-title">❌ The Snapshot Bug — setCount(count + 1) twice</div>
        <CodeBlock code={CODE_WRONG} language="jsx" title="Why this gives +1 instead of +2" />
        <div style={{ marginTop: 16 }}>
          <QueueDiagram
            title="❌  Direct Value — setCount(count + 1)"
            isGood={false}
            snapshotValue={0}
            setCallsCode={
              'setCount(count + 1)  →  JS: 0 + 1 = 1  →  queue: SET TO 1\nsetCount(count + 1)  →  JS: 0 + 1 = 1  →  queue: SET TO 1  (same!)'
            }
            queue={[
              'SET TO 1   ← count was 0',
              'SET TO 1   ← count STILL 0  (stale snapshot!)',
            ]}
            processing={null}
            finalResult="Final: count = 1  (expected 2 — bug!)"
          />
        </div>
        <Note type="error">
          <strong>Why it fails:</strong> Both calls evaluate <Ic>count + 1</Ic> immediately
          using the same frozen snapshot (count = 0). React's queue becomes{' '}
          <Ic>[1, 1]</Ic> — the second call just repeats the same value.
        </Note>
      </div>

      {/* Section 2 — the fix */}
      <div className="section">
        <div className="section-title">✅ The Fix — setCount(prev =&gt; prev + 1) twice</div>
        <CodeBlock code={CODE_RIGHT} language="jsx" title="Functional update — correctly gives +2" />
        <div style={{ marginTop: 16 }}>
          <QueueDiagram
            title="✅  Functional Update — setCount(prev => prev + 1)"
            isGood={true}
            snapshotValue={0}
            setCallsCode={
              'setCount(prev => prev + 1)  →  JS: stores function fn1\nsetCount(prev => prev + 1)  →  JS: stores function fn2'
            }
            queue={[
              '(prev) => prev + 1   ← fn1',
              '(prev) => prev + 1   ← fn2',
            ]}
            processing={[
              { text: 'fn1(prev = 0)  →  returns 1', highlight: false },
              { text: 'fn2(prev = 1)  →  returns 2   ← chains off fn1!', highlight: true },
            ]}
            finalResult="Final: count = 2  ✅"
          />
        </div>
        <Note type="success">
          <strong>Why it works:</strong> React stores the functions in the queue and
          processes them one by one, passing the latest queued result as{' '}
          <Ic>prev</Ic> each time — so they chain: 0 → 1 → 2.
        </Note>
      </div>

      {/* Section 3 — why + behaves differently */}
      <div className="section">
        <div className="section-title">⚡ Why the Same + Operator Behaves Differently</div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.7, marginBottom: 12 }}>
          The <Ic>+</Ic> operator is not the deciding factor —
          it is <strong>when</strong> and <strong>with what value</strong> it runs.
        </p>
        <CodeBlock code={CODE_TIMING} language="jsx" title="Timing: when does + actually execute?" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          {/* Direct value card */}
          <div style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 10,
            padding: '16px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#F87171',
              fontWeight: 700,
              marginBottom: 10,
            }}>setCount(count + 1)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'JS runs count + 1 RIGHT NOW',
                'Uses frozen snapshot value (0)',
                'React receives a fixed number: 1',
                'React queues: SET TO 1',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.82rem' }}>
                  <span style={{
                    background: 'rgba(239,68,68,0.2)',
                    color: '#F87171',
                    minWidth: 20,
                    height: 20,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ color: 'var(--text)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Functional update card */}
          <div style={{
            background: 'rgba(52,211,153,0.06)',
            border: '1px solid rgba(52,211,153,0.3)',
            borderRadius: 10,
            padding: '16px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#34D399',
              fontWeight: 700,
              marginBottom: 10,
            }}>{'setCount(prev => prev + 1)'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'JS stores the function reference',
                'No math runs yet',
                'React receives the function',
                'React calls fn(latestQueued) — + runs HERE',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.82rem' }}>
                  <span style={{
                    background: 'rgba(52,211,153,0.2)',
                    color: '#34D399',
                    minWidth: 20,
                    height: 20,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ color: 'var(--text)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="section">
        <div className="section-title">📋 Quick Comparison</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: 'rgba(249,115,22,0.08)' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', border: '1px solid var(--border)', color: 'var(--text-heading)' }}></th>
                <th style={{ padding: '10px 14px', textAlign: 'left', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', color: '#F87171' }}>{'setCount(count + 1)'}</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', color: '#34D399' }}>{'setCount(prev => prev + 1)'}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['What React receives', 'A fixed number', 'A function'],
                ['When + runs', 'Immediately (in JS)', 'Later (inside React)'],
                ['Uses snapshot?', '✅ Yes — can be stale', '❌ No — uses latest queued'],
                ['Safe for multiple calls?', '❌ No', '✅ Yes'],
                ['Use when', 'State is independent of prev', 'New state depends on prev state'],
              ].map(([label, wrong, right], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '9px 14px', border: '1px solid var(--border)', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{label}</td>
                  <td style={{ padding: '9px 14px', border: '1px solid var(--border)', color: 'var(--text)' }}>{wrong}</td>
                  <td style={{ padding: '9px 14px', border: '1px solid var(--border)', color: 'var(--text)' }}>{right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Golden rule */}
      <div className="section">
        <div className="section-title">🎯 The Golden Rule</div>
        <div style={{
          background: 'rgba(249,115,22,0.08)',
          border: '2px solid rgba(249,115,22,0.35)',
          borderRadius: 10,
          padding: '18px 20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#F87171', fontWeight: 700, marginBottom: 8 }}>
              ❌ Use direct value when:
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.65 }}>
              New state does <strong>not</strong> depend on previous state
              <br /><br />
              Example: <Ic>setCount(0)</Ic> — resetting to a fixed value
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#34D399', fontWeight: 700, marginBottom: 8 }}>
              ✅ Use functional update when:
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.65 }}>
              New state <strong>depends on</strong> previous state
              <br /><br />
              Example: <Ic>{'setCount(prev => prev + 1)'}</Ic> — always safe
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page Render Flow Tab ─────────────────────────────────────────────────────

const PAGE_RENDER_STEPS = [
  {
    number: 1,
    emoji: '🚀',
    title: 'Page Loads — Initial Render',
    desc: 'React calls your component function for the first time. State is initialized with its default value (e.g. useState(0)) and a snapshot of that state is created for this render.',
    note: 'count = 0  (fixed snapshot for this render)',
  },
  {
    number: 2,
    emoji: '🧠',
    title: 'Render Phase — Snapshot Rule',
    desc: 'React executes your component function. All state variables are frozen — they cannot change mid-function. Even if you call setState, the current render\'s value is locked.',
    code: 'console.log(count); // always the same value in this render',
  },
  {
    number: 3,
    emoji: '👆',
    title: 'User Action / Event Trigger',
    desc: 'User clicks a button or triggers an event. The event handler runs — but count inside it is still the frozen snapshot value from when this render happened.',
    code: 'onClick={() => {\n  setCount(count + 1);\n  console.log(count); // still old value!\n}}',
  },
  {
    number: 4,
    emoji: '⏳',
    title: 'setState is Scheduled — Not Immediate',
    desc: 'setCount() does not update the variable right away. React queues the update internally. Multiple setState calls in the same event handler are batched together.',
    note: 'Internal queue: [count → count + 1]',
  },
  {
    number: 5,
    emoji: '🔚',
    title: 'Event Handler Finishes',
    desc: 'React waits until the entire event handler function completes before processing any queued state updates. No state changes happen while the function is still running.',
  },
  {
    number: 6,
    emoji: '🔄',
    title: 'Re-render Happens — New Snapshot',
    desc: 'React calls your component function again with the updated state values. A brand new snapshot is created. The old snapshot is gone.',
    note: 'count = 1  (new snapshot)',
  },
  {
    number: 7,
    emoji: '🎨',
    title: 'UI Updates',
    desc: 'React compares the old virtual DOM with the new one (diffing). Only the parts of the UI that actually changed are updated in the real DOM — efficient and targeted.',
  },
]

function PageRenderTab() {
  const stepItems = []
  PAGE_RENDER_STEPS.forEach((step, i) => {
    stepItems.push(<StepCard key={`sc${i}`} {...step} />)
    if (i < PAGE_RENDER_STEPS.length - 1) {
      stepItems.push(
        <div key={`arr${i}`} style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '1.1rem',
          lineHeight: 1,
          padding: '2px 0',
        }}>↓</div>
      )
    }
  })

  return (
    <div>
      <div className="callout callout-orange">
        The complete journey from page load to UI update — how React processes state,
        creates snapshots, and updates the DOM in 7 clear steps.
      </div>

      {/* 7 Steps */}
      <div className="section">
        <div className="section-title">🔄 Step-by-Step Flow</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {stepItems}
        </div>
      </div>

      {/* Simple flow summary */}
      <div className="section">
        <div className="section-title">🔑 Simple Flow Summary</div>
        <VerticalFlow steps={[
          { text: 'Page Load' },
          { text: 'Initial Render (state snapshot created)', highlight: true },
          { text: 'User Action (click / input)' },
          { text: 'setState called (queued, not immediate)', highlight: true },
          { text: 'Event Handler Ends' },
          { text: 'React Processes Updates (batching)' },
          { text: 'Re-render (new snapshot)', highlight: true },
          { text: 'UI Updates' },
        ]} />
      </div>

      {/* Key concepts */}
      <div className="section">
        <div className="section-title">⚡ Key Concepts</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            {
              icon: '🧊',
              title: 'State is a Snapshot',
              points: ['Each render sees a fixed value', 'No mid-function updates'],
            },
            {
              icon: '⏳',
              title: 'setState is Async / Batched',
              points: ['Updates are scheduled, not instant', 'Multiple calls batch into one render'],
            },
            {
              icon: '🔁',
              title: 'Re-render Applies Changes',
              points: ['Only next render reflects new state', 'Old snapshot is discarded'],
            },
          ].map(item => (
            <div key={item.title} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '16px',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary)', marginBottom: 8 }}>
                {item.title}
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {item.points.map((p, j) => (
                  <li key={j} style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5 }}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bonus */}
        <div style={{
          marginTop: 16,
          background: 'rgba(249,115,22,0.06)',
          border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: 10,
          padding: '16px 18px',
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary)', marginBottom: 8 }}>
            💡 Bonus — Common Interview Insight
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.65, margin: '0 0 10px' }}>
            To avoid stale snapshot issues when new state depends on the previous value, use the functional update form:
          </p>
          <pre style={{
            background: '#0D0E17',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 7,
            padding: '10px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: '#C0CAF5',
            margin: 0,
            lineHeight: 1.6,
            whiteSpace: 'pre',
          }}>{`setCount(prev => prev + 1); // always uses the latest queued value`}</pre>
        </div>
      </div>
    </div>
  )
}

// ─── Q&A Tab ──────────────────────────────────────────────────────────────────

const QA = [
  {
    q: 'What is a "snapshot" in React?',
    a: `A snapshot is the complete set of state values and props captured at the start of a render. Those values are frozen — they cannot change during that render, no matter how many times setState is called.

Interview definition: "A snapshot in React is the immutable state captured during a single render. When setState is called, React does not mutate the current snapshot — it schedules a re-render that creates a brand new snapshot with the updated values."`,
  },
  {
    q: 'Why does console.log(count) show the old value right after calling setCount()?',
    a: `Because state is a snapshot. When the event handler runs, count is frozen at its current render value. Calling setCount() queues a re-render but does NOT update count inside the current function.

The console.log runs in the same render cycle, so it sees the same frozen snapshot.

To log the updated value, use useEffect:
  useEffect(() => {
    console.log(count); // runs after re-render
  }, [count]);`,
  },
  {
    q: 'Why does setCount(count + 1) twice give +1, but setCount(prev => prev + 1) twice give +2?',
    a: `Direct value (count + 1):
JavaScript evaluates count + 1 immediately using the frozen snapshot. Both calls read the same old value (0), so React's queue becomes [SET TO 1, SET TO 1]. Final result: 1.

Functional update (prev => prev + 1):
JavaScript stores the function — no math yet. React processes the function queue step by step, passing the latest queued result as prev each time:
  fn1(prev=0) → 1
  fn2(prev=1) → 2
Final result: 2.

The + operator is the same in both — what differs is WHEN it runs and WHAT value it uses.`,
  },
  {
    q: 'What is the difference between passing a value vs a function to setState?',
    a: `Value form:  setState(newValue)
  → React receives a fixed number
  → Calculated once, right now, using the current snapshot
  → Can produce stale results if called multiple times

Function form:  setState(prev => newValue)
  → React receives a function
  → React calls it with the latest queued state as prev
  → Chains correctly for multiple calls in one render

Rule: always use the functional form when the new state depends on the previous state.`,
  },
  {
    q: 'When does React actually apply the state updates?',
    a: `React batches all setState calls from a single event handler and applies them in a single re-render after the handler finishes.

Order of operations:
1. Event handler runs (all setState calls queue updates)
2. Handler function returns
3. React processes the entire batch
4. Component re-renders with new state (new snapshot created)
5. UI updates on screen

In React 18+, automatic batching also applies to async code (setTimeout, fetch callbacks) as well — not just event handlers.`,
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

// ─── Page export ──────────────────────────────────────────────────────────────

export default function RenderingSnapshot() {
  return (
    <TopicPage
      title="Rendering & Snapshots"
      emoji="📸"
      description="How React freezes state values during each render, why setState does not update immediately, and when to use functional updates over direct values."
      difficulty="Core"
      tabs={[
        { id: 'overview', label: 'Overview', icon: '📖', content: <OverviewTab /> },
        { id: 'pagerender', label: 'Page Render Flow', icon: '🚀', content: <PageRenderTab /> },
        { id: 'howitworks', label: 'How It Works', icon: '⚙️', content: <HowItWorksTab /> },
        { id: 'qa', label: 'Interview Q&A', icon: '❓', content: <QATab /> },
      ]}
    />
  )
}
