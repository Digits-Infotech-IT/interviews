import TopicPage from '../../components/TopicPage'
import CodeBlock from '../../components/CodeBlock'

const CODE_FUNCTIONAL = `// Modern React: functional components with hooks
// Props are destructured from the first argument
function UserCard({ name, role, avatar, onSelect }) {
  return (
    <div className="card" onClick={() => onSelect(name)}>
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}

// Default props via destructuring defaults
function Button({ label, variant = 'primary', disabled = false, onClick }) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// Children prop — component composition
function Card({ title, children, footer }) {
  return (
    <div className="card">
      <div className="card-header"><h2>{title}</h2></div>
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}`

const CODE_MEMO = `import { memo, useState, useCallback } from 'react';

// React.memo — skips re-render if props haven't changed (shallow compare)
const ProductItem = memo(function ProductItem({ product, onAddToCart }) {
  console.log('ProductItem render:', product.name);
  return (
    <div>
      <span>{product.name} — \${product.price}</span>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </div>
  );
});

function ProductList({ products }) {
  const [cart, setCart] = useState([]);

  // Without useCallback, a new function is created each render
  // → ProductItem's props change → memo is bypassed → unnecessary re-render
  const handleAddToCart = useCallback((product) => {
    setCart(prev => [...prev, product]);
  }, []); // no deps — setCart is stable

  return (
    <div>
      <p>Cart: {cart.length} items</p>
      {products.map(p => (
        <ProductItem key={p.id} product={p} onAddToCart={handleAddToCart} />
      ))}
    </div>
  );
}

// When NOT to use memo:
// • Component renders cheaply (most components)
// • Props are objects/arrays created inline (always new reference)
// • Component almost always gets different props`

const CODE_COMPOSITION = `// Composition pattern — prefer over inheritance
// 1. Specialization via props
function Dialog({ title, description, actions }) {
  return (
    <div className="dialog">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="dialog-actions">{actions}</div>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Dialog
      title="Confirm Action"
      description={message}
      actions={
        <>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </>
      }
    />
  );
}

// 2. Render props — pass rendering logic as a prop
function DataProvider({ url, render }) {
  const { data, loading } = useFetch(url);
  if (loading) return <Spinner />;
  return render(data);
}

// Usage: full control over what to render
<DataProvider
  url="/api/users"
  render={(users) => <UserList users={users} />}
/>

// 3. Compound components — shared implicit state
function Accordion({ children }) {
  const [open, setOpen] = useState(null);
  return (
    <AccordionContext.Provider value={{ open, setOpen }}>
      {children}
    </AccordionContext.Provider>
  );
}`

const CODE_LAZY = `import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Code-split at the route level — chunk only loaded when visited
const Dashboard   = lazy(() => import('./pages/Dashboard'));
const Settings    = lazy(() => import('./pages/Settings'));
const Analytics   = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<div className="loading-screen">Loading…</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings"  element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}

// Error boundary — catches render errors in the component tree
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Component error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}`

const QA = [
  {
    q: 'What is the difference between a controlled and uncontrolled component?',
    a: `Controlled: The form element's value is driven by React state. Every keystroke calls onChange, which updates state, which updates the input. Single source of truth.
Uncontrolled: The DOM manages its own state. You read the value via a ref when needed (e.g. on submit). Simpler, but harder to validate in real-time.
Rule of thumb: prefer controlled for anything with validation, formatting, or dynamic submission.`
  },
  {
    q: 'When does React.memo NOT help?',
    a: `1. Props include objects/arrays/functions created inline — new reference every render, memo always re-renders.
2. The component itself is cheap to render — the memo comparison overhead may cost more than the render.
3. The component almost always gets different props — overhead for no benefit.
Pair React.memo with useCallback/useMemo on the parent to stabilize references.`
  },
  {
    q: 'What is the key prop and why is it important?',
    a: `key tells React which list item corresponds to which element across renders. React uses it to reconcile the virtual DOM efficiently.
Using index as key is fine only for static lists (no re-ordering, no adds/removes).
For dynamic lists use a stable unique ID. Wrong keys cause:
• Incorrect animations/transitions
• Stale state in the wrong component
• Unnecessary full remounts instead of updates`
  },
  {
    q: 'What is the difference between props and state?',
    a: `Props: passed from parent to child, read-only inside the child, the parent owns them.
State: managed inside the component, private, can change over time triggering re-renders.
Lifted state: when two sibling components need to share state, lift it to their closest common ancestor and pass it down as props.`
  },
]

function OverviewTab() {
  return (
    <div>
      <div className="callout callout-orange">
        <strong>Modern React:</strong> Since React 16.8, functional components with hooks are the standard.
        Class components still work but are rarely written in new code.
      </div>
      <div className="section">
        <div className="section-title">🧩 Component Design Principles</div>
        <ul>
          <li><strong>Single Responsibility:</strong> Each component does one thing well</li>
          <li><strong>DRY:</strong> Extract repeated JSX into reusable components</li>
          <li><strong>Composition over inheritance:</strong> Build complex UIs by combining simple components</li>
          <li><strong>Lifting state up:</strong> Shared state belongs in the closest common ancestor</li>
          <li><strong>Controlled inputs:</strong> React state is the single source of truth for form values</li>
        </ul>
      </div>
      <div className="section">
        <div className="section-title">⚡ Rendering Rules</div>
        <div className="two-col">
          <div className="comparison-box">
            <h4>Re-render triggers</h4>
            <ul>
              <li>setState / useState setter called</li>
              <li>Parent component re-renders</li>
              <li>Context value changes</li>
              <li>useReducer dispatch called</li>
            </ul>
          </div>
          <div className="comparison-box">
            <h4>Re-render prevention</h4>
            <ul>
              <li>React.memo (memoize component)</li>
              <li>useMemo (memoize value)</li>
              <li>useCallback (memoize function)</li>
              <li>Stable context value reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExamplesTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">1. Functional Components & Props</div>
        <CodeBlock code={CODE_FUNCTIONAL} language="jsx" title="Functional components — destructured props, children" />
      </div>
      <div className="section">
        <div className="section-title">2. React.memo & Optimization</div>
        <CodeBlock code={CODE_MEMO} language="jsx" title="React.memo + useCallback — preventing unnecessary re-renders" />
      </div>
      <div className="section">
        <div className="section-title">3. Composition Patterns</div>
        <CodeBlock code={CODE_COMPOSITION} language="jsx" title="Composition — specialization, render props, compound components" />
      </div>
      <div className="section">
        <div className="section-title">4. Lazy Loading & Error Boundaries</div>
        <CodeBlock code={CODE_LAZY} language="jsx" title="React.lazy + Suspense + ErrorBoundary" />
      </div>
    </div>
  )
}

function RealWorldTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">🌐 Component Architecture in Production</div>
        <ul>
          <li><strong>Atomic Design:</strong> Atoms → Molecules → Organisms → Templates → Pages</li>
          <li><strong>Feature folders:</strong> Keep component, styles, tests, types together per feature</li>
          <li><strong>Lazy loading routes:</strong> Every page-level component is code-split with React.lazy</li>
          <li><strong>Error boundaries:</strong> Wrap feature sections so one crash doesn't break the whole app</li>
          <li><strong>Storybook:</strong> Develop and document components in isolation</li>
        </ul>
      </div>
      <div className="callout callout-info">
        <strong>Interview tip:</strong> Be ready to discuss when you'd extract a component vs keep it inline.
        The rule: when you'd copy-paste JSX a second time, or when the component logic gets complex enough
        to deserve its own test, extract it.
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

export default function ReactComponents() {
  return (
    <TopicPage
      title="React Components"
      emoji="🧩"
      description="Building blocks of React — composition, memoization, patterns, and the rules of effective component design."
      difficulty="Core"
      tabs={[
        { id: 'overview', label: 'Overview', icon: '📖', content: <OverviewTab /> },
        { id: 'examples', label: 'Syntax & Examples', icon: '💻', content: <ExamplesTab /> },
        { id: 'realworld', label: 'Real-World', icon: '🚀', content: <RealWorldTab /> },
        { id: 'qa', label: 'Interview Q&A', icon: '❓', content: <QATab /> },
      ]}
    />
  )
}
