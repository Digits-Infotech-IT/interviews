import TopicPage from '../../components/TopicPage'
import CodeBlock from '../../components/CodeBlock'

const CODE_USE_STATE_VS_REDUCER = `import { useState, useReducer } from 'react';

// useState — simple values, independent fields
function SimpleForm() {
  const [name, setName] = useState('');
  const [age, setAge]   = useState('');
  // Fine for 2-3 independent values
}

// useReducer — complex state, multiple related sub-values, or state transitions with business logic
const initialState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.data };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'NEXT_PAGE':
      return { ...state, page: state.page + 1 };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function ProductList() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchProducts = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res  = await fetch(\`/api/products?page=\${state.page}\`);
      const data = await res.json();
      dispatch({ type: 'FETCH_SUCCESS', data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', error: err.message });
    }
  };

  // ...
}`

const CODE_CONTEXT = `import { createContext, useContext, useReducer, useMemo } from 'react';

// 1. Create context
const AuthContext = createContext(null);

// 2. Provider with value
function AuthProvider({ children }) {
  const [user, setUser] = useReducer(/* ... */);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    setUser({ type: 'LOGIN', user: data });
  };

  const logout = () => {
    api.logout();
    setUser({ type: 'LOGOUT' });
  };

  // Memoize the context value to prevent unnecessary re-renders
  // of every consumer when AuthProvider re-renders for unrelated reasons
  const value = useMemo(
    () => ({ user: user.data, isLoggedIn: !!user.data, login, logout }),
    [user.data]  // only changes when user data actually changes
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Custom hook — better DX, validates context usage
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// 4. Usage
function ProfilePage() {
  const { user, isLoggedIn, logout } = useAuth();

  if (!isLoggedIn) return <Redirect to="/login" />;
  return (
    <div>
      <h1>Hello, {user.name}</h1>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

// Wrap the app
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>...</Routes>
      </Router>
    </AuthProvider>
  );
}`

const CODE_LIFTING = `// Pattern: Lifting State Up
// When sibling components share state, lift to the closest common ancestor

// ❌ Each input manages its own state — they can't communicate
function Bad() {
  return (
    <div>
      <PasswordInput />   {/* has its own state */}
      <ConfirmInput />    {/* has its own state — can't compare */}
    </div>
  );
}

// ✅ Parent owns the state, passes down as props + setter
function PasswordForm() {
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const match = password === confirm && password.length > 0;

  return (
    <form>
      <PasswordInput value={password} onChange={setPassword} />
      <ConfirmInput  value={confirm}  onChange={setConfirm} />
      {!match && <p className="error">Passwords do not match</p>}
      <button disabled={!match}>Submit</button>
    </form>
  );
}

function PasswordInput({ value, onChange }) {
  return <input type="password" value={value} onChange={e => onChange(e.target.value)} />;
}

function ConfirmInput({ value, onChange }) {
  return <input type="password" value={value} onChange={e => onChange(e.target.value)} />;
}`

const QA = [
  {
    q: 'When should you use useReducer instead of useState?',
    a: `Prefer useReducer when:
• State has multiple sub-values that change together
• Next state depends on the current state in complex ways
• State transitions have business logic that should be co-located
• You want to test state logic in isolation from the component
Prefer useState for simple, independent values.`
  },
  {
    q: 'What is the Context API and what are its limitations?',
    a: `Context provides a way to pass values through the component tree without prop drilling.
Limitations:
1. Every consumer re-renders when the context value changes — even if they only use part of it.
2. Not designed as a global state manager — better suited for low-frequency updates (auth, theme, locale).
3. For high-frequency updates (form state, real-time data), use a dedicated state management library or split contexts.
Mitigation: split contexts, useMemo on the provider value, use Zustand/Jotai for frequent updates.`
  },
  {
    q: 'What is prop drilling and how do you solve it?',
    a: `Prop drilling: passing props through multiple intermediate components that don't use them, just to reach a deeply nested component.
Solutions:
1. Context API — for app-wide data (auth, theme)
2. Component composition — render the deep component higher up
3. Custom hooks — encapsulate logic and call in the component that needs it
4. State management libraries — Zustand, Jotai, Redux Toolkit for complex apps`
  },
]

function OverviewTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">🗂️ State Options in React</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { name: 'useState', use: 'Simple local state — counters, toggles, form fields', when: 'Default choice for simple values' },
            { name: 'useReducer', use: 'Complex state with multiple transitions', when: 'Business logic, multiple related fields' },
            { name: 'Context API', use: 'Cross-component state without prop drilling', when: 'Auth, theme, locale — low-frequency updates' },
            { name: 'Zustand / Jotai', use: 'Lightweight global state library', when: 'Shared state with frequent updates' },
            { name: 'React Query / SWR', use: 'Server state — caching, refetching, loading/error', when: 'Any async data from an API' },
          ].map(item => (
            <div key={item.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>{item.name}</span>
              <span style={{ marginLeft: 12, fontSize: '0.875rem', color: 'var(--text)' }}>{item.use}</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>👉 {item.when}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExamplesTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">1. useState vs useReducer</div>
        <CodeBlock code={CODE_USE_STATE_VS_REDUCER} language="jsx" title="When to use each" />
      </div>
      <div className="section">
        <div className="section-title">2. Context API — Auth Example</div>
        <CodeBlock code={CODE_CONTEXT} language="jsx" title="Context API with custom hook pattern" />
      </div>
      <div className="section">
        <div className="section-title">3. Lifting State Up</div>
        <CodeBlock code={CODE_LIFTING} language="jsx" title="Lifting state to share between siblings" />
      </div>
    </div>
  )
}

function RealWorldTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">🌐 Real-World State Architecture</div>
        <ul>
          <li><strong>Server state</strong> (API data) → TanStack Query or SWR. Handles caching, background refetch, loading/error states out of the box.</li>
          <li><strong>Global UI state</strong> (auth, theme, notifications) → Context API or Zustand</li>
          <li><strong>Form state</strong> → React Hook Form (performance-focused, minimal re-renders)</li>
          <li><strong>URL state</strong> → React Router search params (filters, pagination)</li>
          <li><strong>Local component state</strong> → useState, useReducer</li>
        </ul>
      </div>
      <div className="callout callout-info">
        <strong>Architecture tip:</strong> Don't put everything in global state. Collocate state as close
        to where it's used as possible. Only lift it when two components genuinely need to share it.
      </div>
    </div>
  )
}

function QATab() {
  return (
    <div className="qa-list">
      {QA.map((item, i) => (
        <div key={i} className="qa-item">
          <div className="qa-question"><span className="qa-q-icon">Q</span>{item.q}</div>
          <div className="qa-answer" style={{ whiteSpace: 'pre-line' }}>{item.a}</div>
        </div>
      ))}
    </div>
  )
}

export default function StateManagement() {
  return (
    <TopicPage
      title="State Management"
      emoji="🗂️"
      description="How React manages data — from local useState to context, useReducer, and when to reach for external libraries."
      difficulty="Important"
      tabs={[
        { id: 'overview', label: 'Overview', icon: '📖', content: <OverviewTab /> },
        { id: 'examples', label: 'Syntax & Examples', icon: '💻', content: <ExamplesTab /> },
        { id: 'realworld', label: 'Real-World', icon: '🚀', content: <RealWorldTab /> },
        { id: 'qa', label: 'Interview Q&A', icon: '❓', content: <QATab /> },
      ]}
    />
  )
}
