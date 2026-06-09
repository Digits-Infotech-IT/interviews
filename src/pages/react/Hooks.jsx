import TopicPage from '../../components/TopicPage'
import CodeBlock from '../../components/CodeBlock'

const HOOKS_TABLE = [
  { name: 'useState', desc: 'Manage local component state', category: 'State' },
  { name: 'useEffect', desc: 'Run side effects after render', category: 'Effect' },
  { name: 'useCallback', desc: 'Memoize a function reference', category: 'Performance' },
  { name: 'useMemo', desc: 'Memoize an expensive computed value', category: 'Performance' },
  { name: 'useRef', desc: 'Mutable ref; DOM access without re-render', category: 'Ref' },
  { name: 'useContext', desc: 'Consume a React context value', category: 'Context' },
  { name: 'useReducer', desc: 'Complex state with action dispatching', category: 'State' },
  { name: 'useId', desc: 'Generate unique IDs for accessibility', category: 'Utility' },
]

const CODE_USE_STATE = `import { useState } from 'react';

function Counter() {
  // Declare state variable + setter
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      {/* Functional update — safe when new state depends on previous */}
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Object state — must spread to preserve other fields
function Form() {
  const [form, setForm] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </>
  );
}`

const CODE_USE_EFFECT = `import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;          // avoid state update on unmounted component

    setLoading(true);
    setError(null);

    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => { if (!cancelled) { setUser(data); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });

    // Cleanup — runs before next effect or on unmount
    return () => { cancelled = true; };
  }, [userId]);               // re-runs when userId changes

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;
  return <h2>Hello, {user?.name}</h2>;
}`

const CODE_CALLBACK_MEMO = `import { useState, useCallback, useMemo, memo } from 'react';

// memo only prevents re-render if props are shallowly equal
const ExpensiveList = memo(({ items, onRemove }) => {
  console.log('ExpensiveList render');
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => onRemove(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
});

function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Apple', price: 1.5 },
    { id: 2, name: 'Banana', price: 0.5 },
    { id: 3, name: 'Cherry', price: 3.0 },
  ]);
  const [filter, setFilter] = useState('');

  // useCallback — stable function reference between renders
  const handleRemove = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []); // no dependencies → function never re-created

  // useMemo — expensive computation runs only when items/filter change
  const filtered = useMemo(
    () => items.filter(i => i.name.toLowerCase().includes(filter.toLowerCase())),
    [items, filter]
  );

  const totalPrice = useMemo(
    () => filtered.reduce((sum, i) => sum + i.price, 0).toFixed(2),
    [filtered]
  );

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search…" />
      <p>Total: \${totalPrice}</p>
      <ExpensiveList items={filtered} onRemove={handleRemove} />
    </div>
  );
}`

const CODE_USE_REF = `import { useRef, useEffect, useState } from 'react';

// DOM access
function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Auto-focused on mount" />;
}

// Mutable value that does NOT trigger re-render
function Stopwatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);   // persists across renders

  const start = () => {
    intervalRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <div>
      <p>{time}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

// Store previous value pattern
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}`

const CODE_CUSTOM_HOOK = `import { useState, useEffect } from 'react';

// Custom hook — just a function prefixed with "use"
function useFetch(url) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false); } });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Custom hook for localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch { return initialValue; }
  });

  const setStored = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStored];
}

// Usage
function App() {
  const { data, loading, error } = useFetch('/api/products');
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error.message}</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`

const CODE_REALWORLD = `// Shopping cart with multiple hooks working together
import { useState, useCallback, useMemo, useReducer } from 'react';

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      const existing = state.find(i => i.id === action.item.id);
      if (existing) return state.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.item, qty: 1 }];
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY':
      return state.map(i => i.id === action.id ? { ...i, qty: action.qty } : i);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

function useCart() {
  const [items, dispatch] = useReducer(cartReducer, []);

  const addItem    = useCallback((item) => dispatch({ type: 'ADD', item }), []);
  const removeItem = useCallback((id) =>   dispatch({ type: 'REMOVE', id }), []);
  const updateQty  = useCallback((id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }), []);
  const clearCart  = useCallback(() =>        dispatch({ type: 'CLEAR' }), []);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  return { items, total, addItem, removeItem, updateQty, clearCart };
}`

const QA = [
  {
    q: 'What are the Rules of Hooks?',
    a: `Two rules enforced by the eslint-plugin-react-hooks linter:
    1. Only call hooks at the top level — never inside conditions, loops, or nested functions. React relies on the call order to associate state with the right hook slot.
    2. Only call hooks from React function components or custom hooks — not from plain JavaScript functions.`
  },
  {
    q: 'When should you use useMemo vs useCallback?',
    a: `useMemo caches a computed value: useMemo(() => heavyCalc(a, b), [a, b]).
useCallback caches a function reference: useCallback(() => doSomething(x), [x]).
Use useMemo when the computation is expensive (sorting/filtering large arrays, complex math).
Use useCallback when passing a function to a memoized child (React.memo) to prevent unnecessary re-renders.
Premature optimization is a mistake — profile first, then memoize.`
  },
  {
    q: 'How do you avoid stale closures in useEffect?',
    a: `A stale closure captures a value that has since changed. Solutions:
    1. Include the variable in the dependency array so the effect re-runs with fresh values.
    2. Use the functional update form: setCount(prev => prev + 1) — no need to read count.
    3. Use useRef for values that should be readable without re-triggering the effect.
    4. Move the function inside the effect so it always has fresh scope.`
  },
  {
    q: 'What is the difference between useEffect cleanup and componentWillUnmount?',
    a: `componentWillUnmount runs once before the component is destroyed.
useEffect cleanup runs before every re-run of the effect (when deps change) AND on unmount.
This means you must be careful — cleanup runs more frequently than componentWillUnmount, which is actually safer since it prevents stale subscriptions.`
  },
  {
    q: 'When should you use useRef instead of useState?',
    a: `Use useRef when:
    1. You need to access a DOM element (ref={myRef}).
    2. You have a mutable value that should NOT cause a re-render when it changes (timers, previous values, cancel flags, instance-like variables).
    Use useState when the value needs to be reflected in the UI.`
  },
  {
    q: 'How do you create a custom hook?',
    a: `A custom hook is a plain JavaScript function whose name starts with "use" and can call other hooks.
Extract stateful logic that is reused across components. The hook itself is not a component — it returns values/functions for the component to use.
Example: useFetch, useLocalStorage, useDebounce, useWindowSize.`
  },
]

function OverviewTab() {
  return (
    <div>
      <div className="callout callout-orange">
        <strong>What are Hooks?</strong> Hooks (introduced in React 16.8) are functions that let you
        "hook into" React state and lifecycle features from functional components. They replace the need
        for class components.
      </div>

      <div className="section">
        <div className="section-title">📋 Hooks Quick Reference</div>
        <div className="hook-grid">
          {HOOKS_TABLE.map(h => (
            <div key={h.name} className="hook-card">
              <div className="hook-card-name">{h.name}</div>
              <div className="hook-card-desc">{h.desc}</div>
              <span className="badge badge-core" style={{ marginTop: 6 }}>{h.category}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title">⚠️ Rules of Hooks</div>
        <div className="callout callout-warning">
          <strong>Rule 1:</strong> Only call hooks at the <strong>top level</strong> — never inside loops,
          conditions, or nested functions.
        </div>
        <div className="callout callout-warning">
          <strong>Rule 2:</strong> Only call hooks from <strong>React function components</strong> or
          <strong> custom hooks</strong> (functions prefixed with "use").
        </div>
      </div>
    </div>
  )
}

function ExamplesTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">1. useState — Local State</div>
        <CodeBlock code={CODE_USE_STATE} language="jsx" title="useState — Counter + Form" />
      </div>
      <div className="section">
        <div className="section-title">2. useEffect — Side Effects</div>
        <CodeBlock code={CODE_USE_EFFECT} language="jsx" title="useEffect — Data Fetching with Cleanup" />
      </div>
      <div className="section">
        <div className="section-title">3. useCallback + useMemo — Performance</div>
        <CodeBlock code={CODE_CALLBACK_MEMO} language="jsx" title="useCallback + useMemo + React.memo" />
      </div>
      <div className="section">
        <div className="section-title">4. useRef — DOM & Mutable Values</div>
        <CodeBlock code={CODE_USE_REF} language="jsx" title="useRef — DOM access + Stopwatch + usePrevious" />
      </div>
      <div className="section">
        <div className="section-title">5. Custom Hooks</div>
        <CodeBlock code={CODE_CUSTOM_HOOK} language="jsx" title="useFetch + useLocalStorage custom hooks" />
      </div>
    </div>
  )
}

function RealWorldTab() {
  return (
    <div>
      <div className="callout callout-info">
        <strong>Real-World Pattern:</strong> Combining <code>useReducer</code> + <code>useCallback</code> + <code>useMemo</code>
        to build a performant shopping cart as a custom hook.
      </div>
      <CodeBlock code={CODE_REALWORLD} language="jsx" title="useCart — Shopping cart with useReducer" />
      <div className="section" style={{ marginTop: 24 }}>
        <div className="section-title">🌐 Where you'll see this in production</div>
        <ul>
          <li><strong>useFetch / useQuery</strong> — Every production app has some data fetching abstraction (TanStack Query is the popular library version)</li>
          <li><strong>useReducer + context</strong> — App-wide state management without Redux (auth, theme, cart)</li>
          <li><strong>useCallback on event handlers</strong> — Passed to memoized child components in data-heavy UIs (tables, lists)</li>
          <li><strong>useRef for timers</strong> — Debounced search inputs, polling intervals, animation frames</li>
          <li><strong>Custom hooks</strong> — Encapsulating form state, WebSocket connections, intersection observer, media queries</li>
        </ul>
      </div>
    </div>
  )
}

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

export default function ReactHooks() {
  return (
    <TopicPage
      title="React Hooks"
      emoji="🪝"
      description="Functions that let you use state and lifecycle features in functional components — the core of modern React development."
      difficulty="Essential"
      tabs={[
        { id: 'overview', label: 'Overview', icon: '📖', content: <OverviewTab /> },
        { id: 'examples', label: 'Syntax & Examples', icon: '💻', content: <ExamplesTab /> },
        { id: 'realworld', label: 'Real-World', icon: '🚀', content: <RealWorldTab /> },
        { id: 'qa', label: 'Interview Q&A', icon: '❓', content: <QATab /> },
      ]}
    />
  )
}
