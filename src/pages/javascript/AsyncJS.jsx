import TopicPage from '../../components/TopicPage'
import CodeBlock from '../../components/CodeBlock'

const CODE_EVENT_LOOP = `// JavaScript is single-threaded with an event loop
// The event loop processes tasks in this order:
// 1. Call stack (synchronous code)
// 2. Microtask queue (Promise callbacks, queueMicrotask)
// 3. Task queue / macrotask (setTimeout, setInterval, I/O)

console.log('1 — sync');

setTimeout(() => console.log('4 — macrotask (setTimeout 0)'), 0);

Promise.resolve()
  .then(() => console.log('2 — microtask'))
  .then(() => console.log('3 — microtask 2'));

console.log('5 — sync');

// Output order: 1, 5, 2, 3, 4
// Microtasks (Promise .then) always run BEFORE the next macrotask

// queueMicrotask — add to microtask queue directly
queueMicrotask(() => console.log('also a microtask'));`

const CODE_PROMISES = `// Promise — represents an async operation that will eventually resolve or reject

// Creating a Promise
const fetchUser = (id) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (id > 0) resolve({ id, name: 'Alice' });
    else reject(new Error('Invalid ID'));
  }, 500);
});

// Consuming with .then / .catch / .finally
fetchUser(1)
  .then(user => { console.log('User:', user.name); return user; })
  .then(user => fetchUser(user.id + 1))  // chain — each .then returns a new Promise
  .catch(err => console.error('Error:', err.message))
  .finally(() => console.log('Done (always runs)'));

// Promise combinators — run multiple promises concurrently

const p1 = fetch('/api/user');
const p2 = fetch('/api/posts');
const p3 = fetch('/api/comments');

// Promise.all — all or nothing (rejects if any reject)
const [user, posts, comments] = await Promise.all([p1, p2, p3]);

// Promise.allSettled — waits for all, reports each outcome
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log('OK:', r.value);
  else console.error('Failed:', r.reason);
});

// Promise.race — first one wins (resolve OR reject)
const winner = await Promise.race([p1, p2, p3]);

// Promise.any — first SUCCESSFUL resolve wins (ignores rejections)
const fastest = await Promise.any([p1, p2, p3]);`

const CODE_ASYNC_AWAIT = `import { useState, useEffect, useCallback } from 'react';

// async/await — syntactic sugar over Promises
// Makes async code read like synchronous code

async function fetchDashboard(userId) {
  // Sequential — each waits for the previous
  const user    = await fetch(\`/api/users/\${userId}\`).then(r => r.json());
  const profile = await fetch(\`/api/profiles/\${user.id}\`).then(r => r.json());
  return { user, profile };

  // Parallel — start both, then await both (faster!)
  const [orders, wishlist] = await Promise.all([
    fetch(\`/api/orders/\${userId}\`).then(r => r.json()),
    fetch(\`/api/wishlist/\${userId}\`).then(r => r.json()),
  ]);
}

// Error handling with async/await
async function safeApiFetch(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error('Network error — check your connection');
    }
    throw err;  // re-throw unknown errors
  }
}

// In React — proper async in useEffect
function useUserData(userId) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState(s => ({ ...s, loading: true, error: null }));
      try {
        const data = await safeApiFetch(\`/api/users/\${userId}\`);
        if (!cancelled) setState({ data, loading: false, error: null });
      } catch (err) {
        if (!cancelled) setState({ data: null, loading: false, error: err.message });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [userId]);

  return state;
}`

const CODE_PATTERNS = `// Retry with exponential backoff
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return await res.json();
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;   // last attempt — give up
      const delay = Math.pow(2, attempt) * 1000;   // 1s, 2s, 4s...
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Timeout wrapper
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(\`Timed out after \${ms}ms\`)), ms)
  );
  return Promise.race([promise, timeout]);
}

// Usage
const data = await withTimeout(fetch('/api/slow'), 5000);

// Batch concurrent requests with a concurrency limit
async function batchRequests(urls, concurrency = 3) {
  const results = [];

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(url => fetch(url).then(r => r.json())));
    results.push(...batchResults);
  }

  return results;
}

// Debounce async function (search input)
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve, reject) => {
      timer = setTimeout(() => fn(...args).then(resolve).catch(reject), delay);
    });
  };
}

const debouncedSearch = debounce(async (query) => {
  const res = await fetch(\`/api/search?q=\${query}\`);
  return res.json();
}, 300);`

const QA = [
  {
    q: 'What is the JavaScript event loop?',
    a: `JavaScript is single-threaded — it can only execute one thing at a time.
The event loop manages async work:
1. Synchronous code runs on the call stack first.
2. When async work completes, its callback goes into a queue.
3. When the call stack is empty, the event loop checks the microtask queue first (Promises, queueMicrotask), then the macrotask queue (setTimeout, setInterval, I/O).
4. Microtasks are fully drained before the next macrotask starts.`
  },
  {
    q: 'What is the difference between Promise.all, Promise.allSettled, Promise.race, and Promise.any?',
    a: `Promise.all([...]) — resolves when ALL resolve; rejects immediately if ANY reject. Use when you need all results and any failure is fatal.

Promise.allSettled([...]) — waits for ALL to settle (resolve or reject); never rejects itself. Each result has { status, value } or { status, reason }. Use when you need all results regardless of failures.

Promise.race([...]) — resolves/rejects with the FIRST to settle (either outcome). Use for timeout patterns.

Promise.any([...]) — resolves with the FIRST to resolve; rejects only if ALL reject (AggregateError). Use when you have multiple sources and want the fastest success.`
  },
  {
    q: 'What are common async/await pitfalls?',
    a: `1. Sequential awaits when parallel is possible:
   Bad: const a = await fa(); const b = await fb();
   Good: const [a, b] = await Promise.all([fa(), fb()]);

2. Unhandled rejections — always try/catch async functions or .catch() Promises.

3. Not returning the Promise from useEffect (useEffect must return void or a cleanup function, not a Promise).

4. Forgetting that async functions always return a Promise — callers must await them.

5. Using async in array methods: arr.map(async fn) returns Promise[]. You need Promise.all(arr.map(async fn)).`
  },
  {
    q: 'What is the difference between microtasks and macrotasks?',
    a: `Microtasks (Promise .then, .catch, queueMicrotask, MutationObserver): run immediately after the current task, before the browser renders or processes the next macrotask. All microtasks are drained before moving on.

Macrotasks (setTimeout, setInterval, I/O, requestAnimationFrame): each runs in its own task. After each macrotask, microtasks are drained and the browser may render.

Practical impact: setTimeout(fn, 0) is a macrotask — it runs after all pending Promises resolve.`
  },
  {
    q: 'How do you handle errors in async/await?',
    a: `Three approaches:
1. try/catch block — most readable for complex logic
2. .catch() on the returned Promise — good for simple cases
3. Error-first helper: const [err, data] = await to(promise) — inspired by Go error handling

Important: re-throw errors you don't handle, don't silently swallow them.
In React: always catch errors in useEffect and set error state so the UI can show a message.`
  },
]

function OverviewTab() {
  return (
    <div>
      <div className="callout callout-orange">
        <strong>Async JavaScript</strong> is how you deal with operations that take time — network requests,
        timers, file I/O. JavaScript evolved from callbacks → Promises → async/await, each building on the previous.
      </div>
      <div className="section">
        <div className="section-title">🔄 Evolution of Async Patterns</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { era: '1990s–2010s', name: 'Callbacks', desc: 'Pass a function to run when async work completes. Leads to "callback hell" with nested async code.', problem: true },
            { era: '2015 ES6', name: 'Promises', desc: 'Chainable .then()/.catch() — flatter structure, better error handling. But still verbose for complex flows.', problem: false },
            { era: '2017 ES8', name: 'async/await', desc: 'Syntactic sugar over Promises. Makes async code read like synchronous code. The current standard.', problem: false },
          ].map(item => (
            <div key={item.name} style={{ display: 'flex', gap: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
              <span className="badge badge-core" style={{ flexShrink: 0, height: 'fit-content' }}>{item.era}</span>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginBottom: 3 }}>{item.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
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
        <div className="section-title">1. The Event Loop</div>
        <CodeBlock code={CODE_EVENT_LOOP} language="javascript" title="Event loop — call stack, microtasks, macrotasks" />
      </div>
      <div className="section">
        <div className="section-title">2. Promises & Combinators</div>
        <CodeBlock code={CODE_PROMISES} language="javascript" title="Promises — .then, .catch, Promise.all/allSettled/race/any" />
      </div>
      <div className="section">
        <div className="section-title">3. async/await</div>
        <CodeBlock code={CODE_ASYNC_AWAIT} language="javascript" title="async/await — error handling, parallel, useEffect pattern" />
      </div>
      <div className="section">
        <div className="section-title">4. Advanced Patterns</div>
        <CodeBlock code={CODE_PATTERNS} language="javascript" title="Retry, timeout, batching, debounce" />
      </div>
    </div>
  )
}

function RealWorldTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">🌐 Async Patterns in Production</div>
        <ul>
          <li><strong>TanStack Query / SWR:</strong> Handles all async data concerns — caching, deduplication, background refetch, loading/error states. You write the fetch function; the library handles everything else.</li>
          <li><strong>Optimistic updates:</strong> Update the UI immediately on user action, then sync with server. Roll back on failure. Requires careful async coordination.</li>
          <li><strong>Abort controllers:</strong> Cancel in-flight requests when the component unmounts or the user navigates away. Prevents state updates on unmounted components.</li>
          <li><strong>Request deduplication:</strong> Don't fire the same request twice concurrently. Caching libraries do this automatically.</li>
          <li><strong>Background sync:</strong> Service workers queue failed requests and retry when connectivity is restored.</li>
        </ul>
      </div>
      <div className="callout callout-info">
        <strong>Interview tip:</strong> When asked about async, mention the event loop, the difference between
        microtasks and macrotasks, the Promise combinators, and common pitfalls like sequential awaits
        when parallel is possible.
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

export default function AsyncJS() {
  return (
    <TopicPage
      title="Async JavaScript"
      emoji="⚡"
      description="The event loop, Promises, async/await, and the patterns behind every API call in your app."
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
