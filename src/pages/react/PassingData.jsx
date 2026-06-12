import { useState } from 'react'
import TopicPage from '../../components/TopicPage'
import CodeBlock from '../../components/CodeBlock'

// ─── CODE SAMPLES ────────────────────────────────────────────────────────────

const CODE_PROPS_EX = `// Parent owns data, child only displays it
function App() {
  const user = { name: 'Alice', role: 'Admin', avatar: '👩‍💼' };
  return <UserCard user={user} onLogout={() => console.log('logout')} />;
}

function UserCard({ user, onLogout }) {   // props are READ-ONLY
  return (
    <div className="card">
      <span>{user.avatar}</span>
      <h3>{user.name}</h3>
      <p>{user.role}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

// Spread pattern — forward all props to a DOM element
function Button({ children, variant = 'primary', ...rest }) {
  return <button className={\`btn btn-\${variant}\`} {...rest}>{children}</button>;
}`

const CODE_PROPS_MVP = `import { useState } from 'react';

function ProductCard({ name, price, inStock }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8, margin: 8 }}>
      <h4>{name}</h4>
      <p style={{ fontSize: 18 }}>\${price.toFixed(2)}</p>
      <span style={{ color: inStock ? 'green' : 'red' }}>
        {inStock ? '✓ In Stock' : '✗ Out of Stock'}
      </span>
    </div>
  );
}

export default function App() {
  const products = [
    { id: 1, name: 'MacBook Pro', price: 1999, inStock: true },
    { id: 2, name: 'iPhone 15',   price: 999,  inStock: false },
    { id: 3, name: 'AirPods',     price: 249,  inStock: true },
  ];

  return (
    <div>
      {products.map(p => (
        <ProductCard key={p.id} name={p.name} price={p.price} inStock={p.inStock} />
      ))}
    </div>
  );
}`

const CODE_CALLBACK_EX = `import { useState } from 'react';

// Child calls the function the parent passed — sends data UP
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);           // data travels UP to parent
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
}

function App() {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    const data = await fetch(\`/api/search?q=\${query}\`).then(r => r.json());
    setResults(data);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />  {/* pass the handler DOWN */}
      <ul>{results.map((r, i) => <li key={i}>{r.title}</li>)}</ul>
    </div>
  );
}`

const CODE_CALLBACK_MVP = `import { useState } from 'react';

function IncrementButton({ label, onIncrement }) {
  return (
    <button onClick={() => onIncrement(label)}>
      Click {label}
    </button>
  );
}

export default function App() {
  const [log, setLog] = useState([]);

  const handleIncrement = (source) => {
    setLog(prev => [...prev, \`\${source} at \${new Date().toLocaleTimeString()}\`]);
  };

  return (
    <div>
      <IncrementButton label="A" onIncrement={handleIncrement} />
      <IncrementButton label="B" onIncrement={handleIncrement} />
      <ul>{log.map((entry, i) => <li key={i}>{entry}</li>)}</ul>
    </div>
  );
}`

const CODE_LIFTING_EX = `import { useState } from 'react';

// Two siblings need the SAME data → lift to their parent
function TemperatureInput({ scale, temp, onTempChange }) {
  return (
    <fieldset>
      <legend>Temperature in {scale === 'C' ? 'Celsius' : 'Fahrenheit'}</legend>
      <input value={temp} onChange={e => onTempChange(e.target.value)} />
    </fieldset>
  );
}

function BoilingVerdict({ celsius }) {
  return <p>{parseFloat(celsius) >= 100 ? '💧 Water boils!' : '❄️ Not boiling.'}</p>;
}

// Parent is the SINGLE SOURCE OF TRUTH
function Calculator() {
  const [temp, setTemp] = useState('');
  const [scale, setScale] = useState('C');

  const celsius    = scale === 'F' ? ((temp - 32) * 5) / 9 : temp;
  const fahrenheit = scale === 'C' ? (temp * 9) / 5 + 32   : temp;

  return (
    <div>
      <TemperatureInput scale="C" temp={scale === 'C' ? temp : celsius.toFixed(1)}
        onTempChange={v => { setTemp(v); setScale('C'); }} />
      <TemperatureInput scale="F" temp={scale === 'F' ? temp : fahrenheit.toFixed(1)}
        onTempChange={v => { setTemp(v); setScale('F'); }} />
      <BoilingVerdict celsius={celsius} />
    </div>
  );
}`

const CODE_LIFTING_MVP = `import { useState } from 'react';

function Slider({ label, value, onChange }) {
  return (
    <div>
      <label>{label}: <strong>{value}</strong></label>
      <br />
      <input type="range" min="0" max="100" value={value}
        onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}

// Shared state lives in parent — both sliders stay in sync
export default function App() {
  const [value, setValue] = useState(50);

  return (
    <div>
      <Slider label="Slider A" value={value} onChange={setValue} />
      <Slider label="Slider B" value={value} onChange={setValue} />
      <p>Both show: {value}</p>
    </div>
  );
}`

const CODE_CONTEXT_EX = `import { createContext, useContext, useState } from 'react';

// Step 1 — create the context (null = no default; forces provider usage)
const ThemeContext = createContext(null);

// Step 2 — create provider (owns state + exposes updater)
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Step 3 — convenience hook with safety check
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}

// Step 4 — ANY component in the tree reads context — no props passed!
function ToggleButton() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle}>{theme === 'light' ? '🌙 Dark' : '☀️ Light'}</button>;
}

function PageHeader() {
  const { theme } = useTheme();
  return <header style={{ background: theme === 'dark' ? '#1a1a2e' : '#fff' }}>Header</header>;
}

// Step 5 — wrap app with provider
function App() {
  return (
    <ThemeProvider>
      <PageHeader />
      <main><ToggleButton /></main>
    </ThemeProvider>
  );
}`

const CODE_CONTEXT_MVP = `import { createContext, useContext, useState } from 'react';

const CounterContext = createContext(null);

function CounterProvider({ children }) {
  const [count, setCount] = useState(0);
  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  );
}

// No props — reads directly from context
function Display() {
  const { count } = useContext(CounterContext);
  return <h2>Count: {count}</h2>;
}

function Controls() {
  const { setCount } = useContext(CounterContext);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </>
  );
}

export default function App() {
  return (
    <CounterProvider>
      <Display />
      <Controls />
    </CounterProvider>
  );
}`

const CODE_HOOK_EX = `import { useState, useEffect } from 'react';

// Extract + reuse stateful logic across any component
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;   // each call gets its OWN independent state instance
}

// Two unrelated components share the same LOGIC (not the same state)
function Header() {
  const { width } = useWindowSize();
  return <nav>{width < 768 ? '☰' : 'Full Nav'}</nav>;
}

function Sidebar() {
  const { width } = useWindowSize();
  return width >= 768 ? <aside>Sidebar</aside> : null;
}

// Combine with Context to share a SINGLE instance
const SizeContext = createContext(null);

function SizeProvider({ children }) {
  const size = useWindowSize();            // one instance
  return <SizeContext.Provider value={size}>{children}</SizeContext.Provider>;
}

function useSharedSize() {
  return useContext(SizeContext);          // same instance everywhere
}`

const CODE_HOOK_MVP = `import { useState } from 'react';

function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const reset = () => setValues(initialValues);

  return { values, handleChange, reset };
}

// Two different forms — same logic, zero duplication
function LoginForm() {
  const { values, handleChange } = useForm({ email: '', password: '' });
  return (
    <form>
      <input name="email"    value={values.email}    onChange={handleChange} placeholder="Email" />
      <input name="password" value={values.password} onChange={handleChange} placeholder="Password" type="password" />
    </form>
  );
}

function ContactForm() {
  const { values, handleChange, reset } = useForm({ name: '', message: '' });
  return (
    <form>
      <input    name="name"    value={values.name}    onChange={handleChange} placeholder="Name" />
      <textarea name="message" value={values.message} onChange={handleChange} placeholder="Message" />
      <button type="button" onClick={reset}>Clear</button>
    </form>
  );
}`

const CODE_ZUSTAND_EX = `// npm install zustand
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product) => set(state => {
    const existing = state.items.find(i => i.id === product.id);
    if (existing) {
      return { items: state.items.map(i =>
        i.id === product.id ? { ...i, qty: i.qty + 1 } : i
      )};
    }
    return { items: [...state.items, { ...product, qty: 1 }] };
  }),

  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),

  get total() { return get().items.reduce((sum, i) => sum + i.price * i.qty, 0); },
}));

// ANY component anywhere — no Provider, no prop drilling
function CartIcon() {
  const items = useCartStore(state => state.items);  // re-renders only when items change
  return <span>🛒 {items.length}</span>;
}

function AddToCartButton({ product }) {
  const addItem = useCartStore(state => state.addItem);
  return <button onClick={() => addItem(product)}>Add to Cart</button>;
}

function CartTotal() {
  const total = useCartStore(state => state.total);
  return <p>Total: \${total.toFixed(2)}</p>;
}`

const CODE_ZUSTAND_MVP = `// npm install zustand
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset:     () => set({ count: 0 }),
}));

function Counter() {
  const { count, increment, decrement, reset } = useStore();
  return (
    <div>
      <h2>{count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// Works in ANY component — Header doesn't need Counter as a parent
function Header() {
  const count = useStore(state => state.count);
  return <nav>Badge: {count}</nav>;
}`

const CODE_URL_EX = `import { useSearchParams, useParams } from 'react-router-dom';

// Route: /products/:category?sort=price&page=2&q=mac
function ProductList() {
  const { category } = useParams();                  // path param
  const [searchParams, setSearchParams] = useSearchParams();

  const sort  = searchParams.get('sort')        || 'price';
  const page  = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('q')           || '';

  const updateFilter = (key, value) => {
    setSearchParams(prev => {
      prev.set(key, value);
      prev.set('page', '1');     // reset page whenever filter changes
      return prev;
    });
  };

  return (
    <div>
      <h2>Category: {category}</h2>
      <input
        value={query}
        onChange={e => updateFilter('q', e.target.value)}
        placeholder="Search..."
      />
      <select value={sort} onChange={e => updateFilter('sort', e.target.value)}>
        <option value="price">Price</option>
        <option value="name">Name</option>
        <option value="rating">Rating</option>
      </select>
      {/* URL is now shareable: /products/electronics?q=mac&sort=price&page=1 */}
    </div>
  );
}`

const CODE_URL_MVP = `import { useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')   || '';
  const tab   = searchParams.get('tab') || 'all';

  const TABS = ['all', 'images', 'videos', 'news'];

  return (
    <div>
      <input
        value={query}
        onChange={e => setSearchParams({ q: e.target.value, tab })}
        placeholder="Search..."
      />
      {TABS.map(t => (
        <button key={t} onClick={() => setSearchParams({ q: query, tab: t })}
          style={{ fontWeight: tab === t ? 'bold' : 'normal', margin: 4 }}>
          {t}
        </button>
      ))}
      <p>Searching "{query}" in <strong>{tab}</strong></p>
      {/* URL: /search?q=react&tab=videos  — fully shareable & bookmarkable */}
    </div>
  );
}`

const CODE_STORAGE_EX = `import { useState, useEffect } from 'react';

// Reusable hook — reads on mount, syncs on every change
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch { return initialValue; }
  });

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn('localStorage write failed', e); }
  }, [key, value]);

  const remove = () => { localStorage.removeItem(key); setValue(initialValue); };
  return [value, setValue, remove];
}

// Persist user preferences across sessions
function Settings() {
  const [theme,    setTheme]    = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('lang', 'en');
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16);

  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <input type="range" min="12" max="24" value={fontSize}
        onChange={e => setFontSize(Number(e.target.value))} />
    </div>
  );
}`

const CODE_STORAGE_MVP = `import { useState, useEffect } from 'react';

export default function App() {
  // Initialize from storage — lazy initializer runs only once
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to storage on every cart change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <div>
      <button onClick={() => setCart(prev => [...prev, \`Item \${prev.length + 1}\`])}>
        Add Item
      </button>
      <button onClick={() => { setCart([]); localStorage.removeItem('cart'); }}>
        Clear
      </button>
      <p><em>Refresh the page — items persist!</em></p>
      <ul>{cart.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  );
}`

const CODE_REFS_EX = `import { useRef, forwardRef, useImperativeHandle } from 'react';

// Child exposes a CONTROLLED API — parent can't touch raw DOM
const VideoPlayer = forwardRef(function VideoPlayer({ src }, ref) {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play:        () => videoRef.current.play(),
    pause:       () => videoRef.current.pause(),
    seek:   (t)  => { videoRef.current.currentTime = t; },
    getDuration: () => videoRef.current.duration,
  }));

  return <video ref={videoRef} src={src} controls />;
});

// Parent drives the player imperatively — no state needed
function App() {
  const playerRef = useRef(null);

  return (
    <div>
      <VideoPlayer ref={playerRef} src="/video.mp4" />
      <button onClick={() => playerRef.current.play()}>▶ Play</button>
      <button onClick={() => playerRef.current.pause()}>⏸ Pause</button>
      <button onClick={() => playerRef.current.seek(0)}>⏮ Restart</button>
    </div>
  );
}`

const CODE_REFS_MVP = `import { useRef, useState, forwardRef, useImperativeHandle } from 'react';

// Child exposes reset() and getValue() — nothing else
const ChildInput = forwardRef(function ChildInput(_, ref) {
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => ({
    reset:    () => setValue(''),
    getValue: () => value,
  }));

  return (
    <input value={value} onChange={e => setValue(e.target.value)}
      placeholder="Type something..." />
  );
});

export default function App() {
  const inputRef = useRef(null);

  return (
    <div>
      <ChildInput ref={inputRef} />
      <button onClick={() => inputRef.current.reset()}>Reset from Parent</button>
      <button onClick={() => alert(inputRef.current.getValue())}>Read Value</button>
    </div>
  );
}`

const CODE_EVENTBUS_EX = `import { useState, useEffect } from 'react';

// Singleton event bus — lives outside React
const createBus = () => {
  const listeners = new Map();
  return {
    on:   (event, cb) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(cb);
      return () => listeners.get(event)?.delete(cb);   // cleanup fn
    },
    emit: (event, data) => listeners.get(event)?.forEach(cb => cb(data)),
  };
};

export const bus = createBus();

// Publisher — knows NOTHING about ToastContainer
function SaveButton() {
  const handleSave = async () => {
    await saveData();
    bus.emit('notification', { msg: 'Saved!', type: 'success' });
  };
  return <button onClick={handleSave}>Save</button>;
}

// Subscriber — knows NOTHING about SaveButton
function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = bus.on('notification', (data) => {
      setToasts(prev => [...prev, data]);
      setTimeout(() => setToasts(prev => prev.slice(1)), 3000);
    });
    return unsub;    // MUST unsubscribe on unmount or you leak memory
  }, []);

  return (
    <div style={{ position: 'fixed', top: 16, right: 16 }}>
      {toasts.map((t, i) => <div key={i} style={{ background: '#333', color: '#fff', padding: 8, marginBottom: 4, borderRadius: 4 }}>{t.msg}</div>)}
    </div>
  );
}`

const CODE_EVENTBUS_MVP = `import { useState, useEffect } from 'react';

// Minimal event bus
const bus = {
  _e: {},
  on(event, cb) {
    (this._e[event] ??= []).push(cb);
    return () => { this._e[event] = this._e[event].filter(fn => fn !== cb); };
  },
  emit(event, data) { this._e[event]?.forEach(cb => cb(data)); },
};

// Publisher — completely independent from Logger
function ActionButton() {
  return (
    <button onClick={() => bus.emit('action', { ts: Date.now() })}>
      Do Action
    </button>
  );
}

// Subscriber — completely independent from ActionButton
function Logger() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    return bus.on('action', ({ ts }) => {
      setLogs(prev => [...prev, new Date(ts).toLocaleTimeString()]);
    });
  }, []);

  return <ul>{logs.map((l, i) => <li key={i}>{l}</li>)}</ul>;
}

export default function App() {
  return <><ActionButton /><Logger /></>;
}`

// ─── METHODS DATA ─────────────────────────────────────────────────────────────

const METHODS = [
  {
    id: 'props',
    title: 'Props',
    subtitle: 'Parent → Child',
    icon: '⬇️',
    color: '#10b981',
    summary: 'Pass data down the tree via JSX attributes. The child receives an immutable props object — it cannot modify what it was given.',
    keyPoints: [
      'Data flows ONE way: top → bottom',
      'Props are READ-ONLY inside the child (never mutate them)',
      'Any JS value works: strings, objects, arrays, functions, JSX',
      'TypeScript gives you compile-time safety on prop types',
      'Use the spread operator (...rest) to forward unknown props',
    ],
    tip: 'Think of props like function arguments — the parent "calls" the child component and passes in whatever it needs to render correctly.',
    exampleCode: CODE_PROPS_EX,
    mvpCode: CODE_PROPS_MVP,
    useCases: [
      { title: 'Component Configuration', desc: 'variant="primary", size="lg" to a Button component' },
      { title: 'Data Display', desc: 'Pass a user object to UserCard to render their profile' },
      { title: 'Event Handlers', desc: 'Pass onClick, onSubmit callbacks from parent to child' },
      { title: 'Composition', desc: 'children prop lets a parent inject arbitrary JSX into a layout' },
      { title: 'Feature Flags', desc: 'isAdmin={true} to conditionally render privileged actions' },
    ],
    pros: ['Explicit — you can trace data flow just by reading JSX', 'Type-safe with TypeScript', 'Encourages small, reusable, testable components', 'Zero dependencies — built into React'],
    cons: ['Prop drilling — data passes through components that don\'t use it', 'Repetitive when many props are needed', 'Refactoring one prop breaks the whole chain', 'Not suited for global data (auth, theme, locale)'],
  },
  {
    id: 'callbacks',
    title: 'Callback Functions',
    subtitle: 'Child → Parent',
    icon: '⬆️',
    color: '#f59e0b',
    summary: 'The standard pattern for a child to send data upward. Parent passes a function as a prop; child calls it when an event occurs.',
    keyPoints: [
      'Parent defines the handler and owns the state',
      'Child receives the function as a prop (prefix with "on": onSave, onDelete)',
      'Child calls it with data: onSubmit(formData)',
      'Use useCallback to stabilize the function reference',
      'This is React\'s answer to: "how does a child talk to its parent?"',
    ],
    tip: 'This is just passing a function as a prop — nothing React-specific. The child "calls back" to notify the parent of something that happened.',
    exampleCode: CODE_CALLBACK_EX,
    mvpCode: CODE_CALLBACK_MVP,
    useCases: [
      { title: 'Form Submission', desc: 'Child Form calls onSubmit(data) — parent handles API call' },
      { title: 'Delete Actions', desc: 'Child ListItem calls onDelete(id) — parent removes from array' },
      { title: 'Dropdown Selection', desc: 'Child Select calls onSelect(value) — parent updates state' },
      { title: 'Modal Control', desc: 'Child Modal calls onClose() — parent sets isOpen to false' },
      { title: 'Validation Feedback', desc: 'Child field calls onValidate(errors) — parent tracks form validity' },
    ],
    pros: ['Clear communication path visible in JSX', 'Parent keeps full control of state changes', 'Easy to test — just mock the callback', 'Follows React\'s unidirectional data flow'],
    cons: ['Callback hell in deeply nested trees', 'Drilling callbacks through 3+ levels is painful', 'Many callbacks per component becomes messy', 'Signature changes ripple up the tree'],
  },
  {
    id: 'lifting',
    title: 'Lifting State Up',
    subtitle: 'Sibling synchronization',
    icon: '🏗️',
    color: '#8b5cf6',
    summary: 'When siblings need to share or sync state, move that state to their closest common ancestor. The parent becomes the single source of truth.',
    keyPoints: [
      'State lives at the lowest component that BOTH siblings need',
      'Parent owns state + updater functions; siblings receive via props',
      'Guarantees siblings always see the same data',
      'The React-idiomatic solution before reaching for Context',
      '"Derive" values from shared state rather than duplicating it',
    ],
    tip: 'Ask: "Which is the lowest component that needs this state?" If two siblings need it, it belongs in their parent. If they have no common parent, use Context or a store.',
    exampleCode: CODE_LIFTING_EX,
    mvpCode: CODE_LIFTING_MVP,
    useCases: [
      { title: 'Synchronized Inputs', desc: 'Celsius ↔ Fahrenheit — change one, both update' },
      { title: 'Master-Detail', desc: 'Click item in list → show details in panel beside it' },
      { title: 'Multi-step Forms', desc: 'Each step reads/writes to parent-owned form state object' },
      { title: 'Filter + Results', desc: 'FilterPanel and ResultsList both depend on filter criteria' },
      { title: 'Tab Navigation', desc: 'TabBar sets active tab; ContentArea renders based on it' },
    ],
    pros: ['No new APIs — just useState + props', 'Single source of truth prevents desync bugs', 'Easy to understand by reading the parent', 'Trivial to test the parent with different initial states'],
    cons: ['Parent grows large as more state is lifted', 'Still causes prop drilling through intermediaries', 'Every state update re-renders the parent and all children', 'Can turn parent into a "God component" that knows too much'],
  },
  {
    id: 'context',
    title: 'Context API',
    subtitle: 'Tree-wide broadcast',
    icon: '🌐',
    color: '#06b6d4',
    summary: 'React\'s built-in solution for sharing data across the tree without prop drilling. Any component inside the Provider reads the value directly.',
    keyPoints: [
      'Three parts: createContext() → Provider (sends) → useContext() (receives)',
      'Any descendant component can subscribe — regardless of depth',
      'Context value change re-renders ALL consumers — avoid large changing objects',
      'Split contexts by concern: AuthContext, ThemeContext, CartContext',
      'Pair with useReducer for a lightweight Redux pattern',
      'Always create a custom hook (useTheme()) to wrap useContext — adds safety check',
    ],
    tip: 'Context solves "prop drilling" but it\'s a broadcast — every consumer re-renders on value change. Keep context values stable. Split by update frequency.',
    exampleCode: CODE_CONTEXT_EX,
    mvpCode: CODE_CONTEXT_MVP,
    useCases: [
      { title: 'Authentication', desc: 'currentUser available in Header, Profile, PrivateRoute, etc.' },
      { title: 'Theme / Dark Mode', desc: 'theme string consumed by every styled component in the tree' },
      { title: 'Locale / i18n', desc: 'Language and t() translation function anywhere in the app' },
      { title: 'Feature Flags', desc: 'flags.newUI available without passing through 10 components' },
      { title: 'Cart / Wishlist', desc: 'Cart data used in Header badge, Product page, and Checkout' },
    ],
    pros: ['Eliminates prop drilling for cross-cutting concerns', 'Built into React — zero extra dependencies', 'Works great with useReducer for complex state', 'Provider nesting enables different values per subtree'],
    cons: ['All consumers re-render on every value change', 'Implicit dependency — harder to trace than props', 'Requires Provider wrapper to test', 'Not ideal for high-frequency updates (use Zustand/Jotai instead)'],
  },
  {
    id: 'customhooks',
    title: 'Custom Hooks',
    subtitle: 'Reusable logic & state',
    icon: '🪝',
    color: '#ec4899',
    summary: 'A function prefixed with "use" that encapsulates stateful logic. Each component that calls it gets its own independent state. Combine with Context to share a single instance.',
    keyPoints: [
      'Just a JS function — starts with "use", can call other hooks',
      'Each call = independent state instance (not shared by default)',
      'Combine with Context to share ONE instance across components',
      'Extracts logic that would otherwise be copy-pasted across components',
      'Makes components lean: they just call hooks and render',
      'Signal to extract: copying stateful logic into a second component',
    ],
    tip: 'Custom hooks = extract → reuse → compose. If you\'re copy-pasting useState + useEffect logic into a second component, that\'s your signal to extract a custom hook.',
    exampleCode: CODE_HOOK_EX,
    mvpCode: CODE_HOOK_MVP,
    useCases: [
      { title: 'Data Fetching', desc: 'useFetch(url) — loading/data/error state in any component' },
      { title: 'Form Handling', desc: 'useForm(initialValues) — reuse across LoginForm, ContactForm, etc.' },
      { title: 'Browser APIs', desc: 'useLocalStorage, useWindowSize, useOnlineStatus, useMediaQuery' },
      { title: 'Subscriptions', desc: 'useWebSocket(url) — subscribe + cleanup without boilerplate' },
      { title: 'Context Wrappers', desc: 'useAuth() wrapping useContext(AuthContext) with null check' },
    ],
    pros: ['DRY: one hook, used in many components', 'Testable independently from any component', 'Composable: hooks call other hooks', 'Keeps component JSX clean'],
    cons: ['Each call = own state instance, NOT shared automatically', 'Overuse creates complex hook chains', 'Must follow Rules of Hooks (no conditionals)', 'Not a substitute for global state management'],
  },
  {
    id: 'statelib',
    title: 'State Libraries',
    subtitle: 'Zustand / Redux / Jotai',
    icon: '🗃️',
    color: '#f97316',
    summary: 'External stores live outside the React tree. Any component subscribes to exactly the slice it needs — no Provider required (Zustand/Jotai), no prop drilling, selective re-renders.',
    keyPoints: [
      'Zustand: hook-based, minimal, no Provider — best default for most apps',
      'Redux Toolkit: opinionated, excellent devtools, enterprise-friendly',
      'Jotai/Recoil: atomic model — fine-grained reactivity per atom',
      'Components subscribe to a selector; re-render ONLY when that slice changes',
      'Devtools: time-travel, action replay, state snapshots',
      'Rule of thumb: useState for local, Context for tree-wide, Zustand for global',
    ],
    tip: 'Key insight: the store is a JavaScript object OUTSIDE React. Components subscribe to slices. Only subscribed components re-render when that slice changes — much more efficient than Context.',
    exampleCode: CODE_ZUSTAND_EX,
    mvpCode: CODE_ZUSTAND_MVP,
    useCases: [
      { title: 'Shopping Cart', desc: 'Items accessed from Header, ProductPage, and Checkout simultaneously' },
      { title: 'Auth State', desc: 'User session, token, and permissions available app-wide' },
      { title: 'Notification Queue', desc: 'Any component pushes notifications; a single listener renders them' },
      { title: 'Real-time Data', desc: 'WebSocket messages dispatched to store; subscribers react' },
      { title: 'Undo / Redo', desc: 'Redux middleware enables action history and time-travel debugging' },
    ],
    pros: ['Zero prop drilling — any component reads any state', 'Selective re-renders via selectors — very efficient', 'DevTools: time-travel, action inspection', 'Scales to large apps and large teams'],
    cons: ['Adds a dependency', 'Boilerplate (Redux; RTK helps a lot)', 'State outside React — harder to reason about from JSX alone', 'Overkill for simple apps — useState + Context is often enough'],
  },
  {
    id: 'urlparams',
    title: 'URL Params',
    subtitle: 'React Router state',
    icon: '🔗',
    color: '#14b8a6',
    summary: 'Encode state in the URL via path params (/products/:id) or query strings (?sort=price&page=2). React Router\'s hooks read and update URL state reactively.',
    keyPoints: [
      'useParams() reads path params: /users/:id → { id: "42" }',
      'useSearchParams() reads/writes query string: ?tab=profile',
      'URL state is shareable, bookmarkable, and back-button compatible',
      'Values are always STRINGS — parse numbers/booleans explicitly',
      'setSearchParams merges by default — pass a function to keep existing params',
      'URL is the ultimate source of truth for navigation-related state',
    ],
    tip: 'Ask: "Would I want the user to share this as a link and have the other person see the same thing?" If yes, that state belongs in the URL.',
    exampleCode: CODE_URL_EX,
    mvpCode: CODE_URL_MVP,
    useCases: [
      { title: 'Search & Filters', desc: '?q=react&category=books&sort=relevance — shareable results' },
      { title: 'Pagination', desc: '?page=3&limit=20 — direct link to page 3 of results' },
      { title: 'Active Tab', desc: '?tab=settings — deep link to a specific tab on load' },
      { title: 'Resource ID', desc: '/products/42 — canonical link to a specific product' },
      { title: 'Modal / Drawer', desc: '?modal=confirm — open a specific modal from a link' },
    ],
    pros: ['Shareable: the URL IS the state', 'Free browser back/forward navigation', 'No localStorage/cookies needed', 'SEO-friendly for SSR/static content'],
    cons: ['Values are strings only — manual type conversion needed', 'URL length limit ~2000 chars', 'Never put sensitive data in URLs', 'Can clutter URLs when overused for trivial state'],
  },
  {
    id: 'storage',
    title: 'Local / Session Storage',
    subtitle: 'Browser persistence',
    icon: '💾',
    color: '#64748b',
    summary: 'Browser Web Storage persists key-value data. Not reactive by default — wrap in useState + useEffect to integrate with React. localStorage survives browser restarts; sessionStorage clears on tab close.',
    keyPoints: [
      'localStorage: persists until explicitly cleared',
      'sessionStorage: cleared when the tab closes',
      'Values are strings — JSON.stringify/parse for objects',
      'Lazy initializer in useState: () => JSON.parse(localStorage.getItem(key))',
      'Sync writes in useEffect: localStorage.setItem(key, JSON.stringify(value))',
      'StorageEvent fires in OTHER tabs — enables cross-tab sync',
    ],
    tip: 'Storage is a persistence layer, not a state mechanism. The pattern: read from storage on mount (lazy initializer), write to storage on state change (useEffect).',
    exampleCode: CODE_STORAGE_EX,
    mvpCode: CODE_STORAGE_MVP,
    useCases: [
      { title: 'User Preferences', desc: 'Theme, font size, language — persist without login' },
      { title: 'Draft Saving', desc: 'Auto-save form drafts so users can continue after refresh' },
      { title: 'Guest Cart', desc: 'Cart items survive refresh until checkout or explicit clear' },
      { title: 'Onboarding Flags', desc: 'hasSeenWelcomeTour = true — show once, never again' },
      { title: 'Recent Searches', desc: 'Last 5 search queries for autocomplete suggestions' },
    ],
    pros: ['Persists across reloads and browser restarts (localStorage)', 'No server required — client-only', 'Simple API (setItem/getItem)', '5-10MB capacity — large enough for most UI state'],
    cons: ['Synchronous — can block main thread on large reads', 'Not reactive between tabs without extra work', 'XSS risk: malicious scripts can read localStorage', 'Not available in SSR environments (window is undefined)'],
  },
  {
    id: 'refs',
    title: 'Refs',
    subtitle: 'Imperative child control',
    icon: '🎯',
    color: '#ef4444',
    summary: 'React\'s escape hatch for imperative patterns. forwardRef passes a ref into a child; useImperativeHandle defines what the parent can call. Use when declarative data flow won\'t work.',
    keyPoints: [
      'useRef creates a mutable container — .current holds the value',
      'forwardRef wraps a component to accept a ref from its parent',
      'useImperativeHandle defines the "remote control" API the parent sees',
      'Ref changes do NOT trigger re-renders (that\'s the point)',
      'ref.current is null before mount and after unmount — always null-check',
      'Use sparingly — signals something declarative isn\'t possible',
    ],
    tip: 'useImperativeHandle is a "remote control" for the child. The parent presses buttons; the child decides what each button does internally. The parent can\'t see the child\'s raw DOM.',
    exampleCode: CODE_REFS_EX,
    mvpCode: CODE_REFS_MVP,
    useCases: [
      { title: 'Focus Management', desc: 'Parent triggers inputRef.current.focus() after a modal opens' },
      { title: 'Media Control', desc: 'Parent controls play/pause/seek on a child video player' },
      { title: 'Form Reset', desc: 'Wizard parent calls childForm.current.reset() on step change' },
      { title: 'Animation Triggers', desc: 'Parent calls child.play() or child.reverse() on an animation' },
      { title: 'Scroll Control', desc: 'Parent calls listRef.current.scrollToItem(id)' },
    ],
    pros: ['No re-renders on change — silent, efficient', 'Imperative control that\'s awkward to express declaratively', 'Child controls its own internals; parent sees only the API', 'Essential for DOM operations and 3rd-party lib integration'],
    cons: ['Bypasses React\'s declarative model', 'Tight coupling between parent and child implementation', 'Easy to misuse — reach for this only when declarative fails', 'Null-check required (ref is null before mount)'],
  },
  {
    id: 'eventbus',
    title: 'Event Bus',
    subtitle: 'Pub/Sub decoupling',
    icon: '📡',
    color: '#7c3aed',
    summary: 'A global publish/subscribe singleton lets components communicate without importing each other. Publishers emit; subscribers listen. Completely decoupled — neither side knows the other exists.',
    keyPoints: [
      'Not a React pattern — general JS adapted for React',
      'Shared singleton (the bus) is the communication channel',
      'Subscribers MUST unsubscribe on unmount — memory leaks otherwise',
      'Events are strings — TypeScript union types add safety',
      'Context + useReducer replaces this in most React-native scenarios',
      'Browser\'s CustomEvent + window.dispatchEvent is a native alternative',
    ],
    tip: 'Event bus is the "last resort" for truly decoupled communication. If two components have any common ancestor, use Context or lifting state instead.',
    exampleCode: CODE_EVENTBUS_EX,
    mvpCode: CODE_EVENTBUS_MVP,
    useCases: [
      { title: 'Toast Notifications', desc: 'Any component emits "toast"; ToastContainer renders it' },
      { title: 'Analytics / Tracking', desc: 'Components emit "track" events; Analytics module logs them' },
      { title: 'Plugin Systems', desc: 'Core emits lifecycle events; plugins subscribe to extend behavior' },
      { title: 'Micro-frontends', desc: 'Independently deployed shells communicate via shared bus' },
      { title: 'Cross-tab Communication', desc: 'Combined with BroadcastChannel for cross-tab events' },
    ],
    pros: ['Completely decoupled — publisher and subscriber never import each other', 'Add subscribers without changing publishers', 'Familiar to Angular/Vue developers', 'Works across independently rendered React trees'],
    cons: ['Hard to trace — where did this event originate?', 'Memory leaks if you forget to unsubscribe', 'No type safety by default (magic strings)', 'Antipattern in most React apps — Context is almost always better'],
  },
]

// ─── COMPARISON TABLE DATA ────────────────────────────────────────────────────

const COMPARISON = [
  { method: 'Props',             direction: 'Parent → Child',    complexity: '⭐',    scope: 'Local',       persists: '✗', reactive: '✓' },
  { method: 'Callbacks',        direction: 'Child → Parent',    complexity: '⭐',    scope: 'Local',       persists: '✗', reactive: '✓' },
  { method: 'Lifting State',    direction: 'Siblings (via parent)', complexity: '⭐⭐', scope: 'Subtree', persists: '✗', reactive: '✓' },
  { method: 'Context API',      direction: 'Any depth',         complexity: '⭐⭐',   scope: 'Tree',        persists: '✗', reactive: '✓' },
  { method: 'Custom Hooks',     direction: 'Reusable logic',    complexity: '⭐⭐',   scope: 'Per-instance',persists: '✗', reactive: '✓' },
  { method: 'Zustand/Redux',    direction: 'Global',            complexity: '⭐⭐⭐', scope: 'App-wide',    persists: '✗', reactive: '✓' },
  { method: 'URL Params',       direction: 'Navigation state',  complexity: '⭐⭐',   scope: 'App-wide',    persists: '✓', reactive: '✓' },
  { method: 'LocalStorage',     direction: 'Across sessions',   complexity: '⭐⭐',   scope: 'Browser',     persists: '✓', reactive: '⚠️' },
  { method: 'Refs',             direction: 'Parent → Child (imperative)', complexity: '⭐⭐⭐', scope: 'Local', persists: '✗', reactive: '✗' },
  { method: 'Event Bus',        direction: 'Any → Any',         complexity: '⭐⭐⭐', scope: 'App-wide',    persists: '✗', reactive: '✓' },
]

const QA = [
  {
    q: 'What is "prop drilling" and how do you fix it?',
    a: `Prop drilling happens when you pass data through multiple intermediate components that don't use the data themselves — just to reach a deeply nested child.

Fix options (escalating complexity):
1. Component composition — restructure so the consumer is closer to the provider
2. Context API — broadcast data to any depth without threading props
3. State library (Zustand) — any component reads from a global store directly

Don't reach for Context or Zustand immediately. First ask: "Can I restructure the component tree so the data doesn't need to travel so far?"`,
  },
  {
    q: 'When should you use Context vs Zustand?',
    a: `Context: built-in, no dependency. Best for low-frequency updates (theme, auth, locale). Every context value change re-renders ALL consumers — that's fine for values that change rarely.

Zustand: external store, components subscribe to slices. Best for high-frequency or complex state (cart, real-time data). Only subscribed components re-render when their slice changes.

Rule of thumb:
- useState → local component state
- Context → tree-wide config that changes infrequently
- Zustand → global state that multiple components write/read with different slices`,
  },
  {
    q: 'Why do we need to unsubscribe from an event bus in useEffect?',
    a: `When a component mounts, it registers a listener on the bus. When the component unmounts, it no longer exists — but the listener still holds a reference to the component's setState function.

Without cleanup:
- The listener fires → calls setState on an unmounted component → React warning
- The closed-over variables in the callback aren't garbage-collected → memory leak
- Old subscriptions accumulate if the component mounts/unmounts repeatedly

The cleanup return from useEffect is called before the next run AND on unmount. Return the unsubscribe function: return bus.on('event', handler).`,
  },
  {
    q: 'When should you use useImperativeHandle vs props for parent-child communication?',
    a: `Use props (the default) when:
- The parent controls child behavior declaratively (passing isOpen, value, etc.)
- The child re-renders to reflect the new state

Use useImperativeHandle when:
- You need to trigger an action without a state change (focus(), play(), reset())
- You're wrapping a third-party library that needs imperative DOM access
- The operation is "fire-and-forget" — no render needed

Warning signs you're misusing refs: storing derived data in them, using them to avoid proper state flow, reading .current during render. Those patterns usually indicate the design needs restructuring.`,
  },
  {
    q: 'How do you share state between two components that have no common parent?',
    a: `If they have no common parent in the React tree, you have three clean options:

1. Context API — wrap both in a common Provider higher up (even if it means refactoring the tree slightly)
2. State library (Zustand/Jotai) — components subscribe to a store that exists outside the tree
3. URL params — if the state is navigation-related, encode it in the URL

Event bus is an option but is considered an antipattern in React since it breaks traceability. localStorage works if the state only needs to sync on the next render/load, not in real-time.`,
  },
  {
    q: 'Can custom hooks share state between components?',
    a: `Not by default. Each component that calls a custom hook gets its own independent copy of the state.

useFetch('/api/users') called in ComponentA and ComponentB creates TWO separate fetch requests and TWO separate loading/data/error states.

To share a single state instance via a custom hook, combine it with Context:
1. Create a custom hook that manages the state
2. Call that hook once inside a Provider component
3. Expose the result via Context
4. Wrap the hook with useContext() — consumers get the same shared instance

This is the "Context + Custom Hook" pattern used by React Query, React Router, etc.`,
  },
]

// ─── DEEP DIVE SUB-COMPONENT ──────────────────────────────────────────────────

const METHOD_TABS = ['Definition', 'Example', 'MVP', 'Use Cases', 'Pros & Cons']
const METHOD_TAB_ICONS = ['📖', '💻', '🚀', '🎯', '⚖️']

function MethodDetail({ method }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      {/* Method sub-tabs */}
      <div className="topic-tabs" style={{ marginBottom: 0 }}>
        {METHOD_TABS.map((tab, i) => (
          <button
            key={tab}
            className={`tab-btn${activeTab === i ? ' active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {METHOD_TAB_ICONS[i]} {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {/* DEFINITION */}
        {activeTab === 0 && (
          <div>
            <div className="callout callout-orange">
              <strong>What it is:</strong> {method.summary}
            </div>
            <div className="section">
              <div className="section-title">Key Points</div>
              <ul style={{ lineHeight: 1.8 }}>
                {method.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div className="callout callout-info">
              <strong>Mental model:</strong> {method.tip}
            </div>
          </div>
        )}

        {/* EXAMPLE */}
        {activeTab === 1 && (
          <div>
            <div className="callout callout-info">
              Real-world usage pattern — the kind of code you'll write in a production app.
            </div>
            <CodeBlock code={method.exampleCode} language="jsx" title={`${method.title} — Real-World Example`} />
          </div>
        )}

        {/* MVP */}
        {activeTab === 2 && (
          <div>
            <div className="callout callout-orange">
              <strong>Minimal working demo</strong> — paste this into a new React app to see it run immediately.
            </div>
            <CodeBlock code={method.mvpCode} language="jsx" title={`${method.title} — MVP Demo`} />
          </div>
        )}

        {/* USE CASES */}
        {activeTab === 3 && (
          <div>
            <div className="section-title">When to use {method.title}</div>
            <div className="hook-grid" style={{ marginTop: 16 }}>
              {method.useCases.map((uc, i) => (
                <div key={i} className="hook-card">
                  <div className="hook-card-name">{uc.title}</div>
                  <div className="hook-card-desc">{uc.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROS & CONS */}
        {activeTab === 4 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div className="section-title" style={{ color: '#10b981' }}>✓ Pros</div>
              <ul style={{ lineHeight: 2 }}>
                {method.pros.map((p, i) => (
                  <li key={i} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="section-title" style={{ color: '#ef4444' }}>✗ Cons</div>
              <ul style={{ lineHeight: 2 }}>
                {method.cons.map((c, i) => (
                  <li key={i} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PAGE TABS ────────────────────────────────────────────────────────────────

function DeepDiveTab() {
  const [selected, setSelected] = useState(0)

  return (
    <div>
      {/* Method picker grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 10,
        marginBottom: 24,
      }}>
        {METHODS.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setSelected(i)}
            style={{
              border: selected === i ? `2px solid ${m.color}` : '2px solid var(--border)',
              borderRadius: 10,
              padding: '10px 12px',
              textAlign: 'left',
              cursor: 'pointer',
              background: selected === i ? `${m.color}18` : 'var(--bg-card)',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 20 }}>{m.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4, color: selected === i ? m.color : 'var(--text)' }}>
              {m.title}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Selected method header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
        paddingBottom: 16,
        borderBottom: `2px solid ${METHODS[selected].color}`,
      }}>
        <span style={{ fontSize: 32 }}>{METHODS[selected].icon}</span>
        <div>
          <h3 style={{ margin: 0, color: METHODS[selected].color }}>{METHODS[selected].title}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{METHODS[selected].subtitle}</span>
        </div>
      </div>

      <MethodDetail key={selected} method={METHODS[selected]} />
    </div>
  )
}

function OverviewTab() {
  return (
    <div>
      <div className="callout callout-orange">
        <strong>10 patterns to know.</strong> Each solves a different data-sharing problem.
        Use the right tool for the scope: <em>props</em> for local, <em>Context</em> for tree-wide,
        <em> Zustand</em> for global, <em>URL</em> for navigation state.
      </div>

      <div className="hook-grid">
        {METHODS.map(m => (
          <div key={m.id} className="hook-card" style={{ borderLeft: `3px solid ${m.color}` }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
            <div className="hook-card-name" style={{ color: m.color }}>{m.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{m.subtitle}</div>
            <div className="hook-card-desc">{m.summary.slice(0, 90)}…</div>
          </div>
        ))}
      </div>

      <div className="section" style={{ marginTop: 32 }}>
        <div className="section-title">🗺️ Decision Guide — Which pattern to pick?</div>
        <div className="callout callout-info" style={{ marginTop: 12 }}>
          <strong>1 — Same component?</strong> → useState, no passing needed.<br />
          <strong>2 — Direct parent → child?</strong> → Props.<br />
          <strong>3 — Child → parent?</strong> → Callback function.<br />
          <strong>4 — Two siblings need same data?</strong> → Lift state to parent.<br />
          <strong>5 — Many levels deep, read-only?</strong> → Context API.<br />
          <strong>6 — Global, frequent writes?</strong> → Zustand / Redux.<br />
          <strong>7 — Navigation / shareable?</strong> → URL params.<br />
          <strong>8 — Survives refresh?</strong> → localStorage / sessionStorage.<br />
          <strong>9 — Trigger imperative action?</strong> → Refs + useImperativeHandle.<br />
          <strong>10 — Totally decoupled micro-frontends?</strong> → Event bus.
        </div>
      </div>
    </div>
  )
}

function ComparisonTab() {
  return (
    <div>
      <div className="callout callout-info">
        Quick reference — compare all 10 patterns at a glance.
        <strong> Reactive</strong> = React re-renders automatically when the value changes.
        <strong> Persists</strong> = survives a page refresh.
      </div>
      <div style={{ overflowX: 'auto', marginTop: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--primary)' }}>
              {['Method', 'Direction', 'Complexity', 'Scope', 'Persists', 'Reactive'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-card)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>{row.method}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{row.direction}</td>
                <td style={{ padding: '10px 14px' }}>{row.complexity}</td>
                <td style={{ padding: '10px 14px' }}>{row.scope}</td>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>{row.persists}</td>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>{row.reactive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section" style={{ marginTop: 32 }}>
        <div className="section-title">⚡ Senior dev rule of thumb</div>
        <div className="callout callout-warning">
          Start with the simplest option that solves the problem. Add complexity only when you feel real pain.
          <br /><br />
          <strong>90% of cases:</strong> Props + Callbacks + Lifting State = enough.<br />
          <strong>Cross-cutting concerns:</strong> Context (auth, theme, locale).<br />
          <strong>Complex global state:</strong> Zustand first, Redux when team/tooling demands it.<br />
          <strong>Never use an event bus</strong> when a common ancestor exists.
        </div>
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

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export default function PassingData() {
  return (
    <TopicPage
      title="Passing Data Between Components"
      emoji="🔄"
      description="10 patterns for sharing data across your React component tree — what each one does, when to reach for it, and when to avoid it."
      difficulty="Important"
      tabs={[
        { id: 'overview',   label: 'Overview',     icon: '📋', content: <OverviewTab /> },
        { id: 'deepdive',   label: 'Deep Dive',    icon: '🔍', content: <DeepDiveTab /> },
        { id: 'comparison', label: 'Comparison',   icon: '📊', content: <ComparisonTab /> },
        { id: 'qa',         label: 'Interview Q&A',icon: '❓', content: <QATab /> },
      ]}
    />
  )
}
