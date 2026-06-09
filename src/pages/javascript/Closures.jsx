import TopicPage from '../../components/TopicPage'
import CodeBlock from '../../components/CodeBlock'

const CODE_SCOPE = `// JavaScript uses LEXICAL scope — scope is determined by where code is written, not where it's called

const x = 'global';

function outer() {
  const x = 'outer';       // shadows global x

  function inner() {
    const x = 'inner';     // shadows outer x
    console.log(x);        // 'inner'
  }

  inner();
  console.log(x);          // 'outer'
}

outer();
console.log(x);            // 'global'

// var vs let vs const scope
function scopeDemo() {
  // var is FUNCTION-scoped — leaks out of blocks
  if (true) {
    var functionScoped = 'I leak out of blocks';
    let blockScoped    = 'I stay in my block';
    const alsoBlock    = 'me too';
  }

  console.log(functionScoped); // works (bad!)
  // console.log(blockScoped); // ReferenceError
}

// Hoisting — declarations are moved to the top of their scope
console.log(hoisted);   // undefined (not ReferenceError) — hoisted but not initialized
var hoisted = 'value';

// console.log(notHoisted); // ReferenceError — let/const in temporal dead zone
let notHoisted = 'value';

// Function declarations are fully hoisted (including the body)
sayHello(); // works!
function sayHello() { console.log('Hello'); }

// Function expressions are NOT fully hoisted
// greet(); // TypeError: greet is not a function
const greet = function() { console.log('Hi'); };`

const CODE_CLOSURE = `// A closure is a function that "remembers" the variables from its outer scope
// even after the outer function has returned

function makeCounter(start = 0) {
  let count = start;  // this variable is "closed over"

  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: ()    => { count = start; },
    value: ()    => count,
  };
}

const counter = makeCounter(10);
console.log(counter.value());     // 10
counter.increment();
counter.increment();
console.log(counter.value());     // 12
counter.reset();
console.log(counter.value());     // 10

// Each call to makeCounter creates an independent closure
const counterA = makeCounter(0);
const counterB = makeCounter(100);
counterA.increment();
console.log(counterA.value()); // 1
console.log(counterB.value()); // 100 — completely independent

// Practical: factory functions
function multiplier(factor) {
  return (number) => number * factor;   // closes over factor
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15`

const CODE_GOTCHA = `// Classic closure gotcha: loop + var

// ❌ Bug: all callbacks share the same i (var is function-scoped)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Logs: 3 3 3  (not 0 1 2)

// ✅ Fix 1: use let (block-scoped — creates a new binding each iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Logs: 0 1 2

// ✅ Fix 2: IIFE (create a new scope with a copy of i)
for (var i = 0; i < 3; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 100);
  })(i);
}
// Logs: 0 1 2

// ✅ Fix 3: bind or closure factory
for (var i = 0; i < 3; i++) {
  setTimeout(console.log.bind(null, i), 100);
}

// Another gotcha: shared mutable state
function createAdders() {
  const adders = [];
  for (var i = 1; i <= 3; i++) {
    adders.push((n) => n + i);   // all capture the same i
  }
  return adders;
}
// After loop: i === 4
createAdders()[0](10); // 14, not 11!  ← bug

// Fix: let
function createAddersFix() {
  const adders = [];
  for (let i = 1; i <= 3; i++) {
    adders.push((n) => n + i);   // each iteration has its own i
  }
  return adders;
}
createAddersFix()[0](10); // 11 ✅`

const CODE_PATTERNS = `// Module pattern — using closures for private state
const BankAccount = (function() {
  // "Private" via closure — not accessible from outside
  let balance = 0;
  const transactions = [];

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error('Invalid amount');
      balance += amount;
      transactions.push({ type: 'deposit', amount });
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      transactions.push({ type: 'withdraw', amount });
      return balance;
    },
    getBalance: () => balance,
    getHistory: () => [...transactions],   // return a copy, not the original
  };
})();

// IIFE — Immediately Invoked Function Expression
// • Creates a new scope to avoid polluting global scope
// • One-time initialization code
const config = (function() {
  const env = process.env.NODE_ENV;
  const isDev = env === 'development';

  return {
    apiUrl: isDev ? 'http://localhost:3000' : 'https://api.example.com',
    debug: isDev,
    version: '2.1.0',
  };
})();

// Memoization using closure
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('Cache hit:', key);
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return expensiveFib(n - 1) + expensiveFib(n - 2);
});`

const QA = [
  {
    q: 'What is a closure and how does it work?',
    a: `A closure is a function that retains access to variables from its outer (enclosing) lexical scope even after the outer function has returned.

Every function in JavaScript forms a closure over the scope where it was defined. When the outer function returns, the closed-over variables are not garbage collected as long as the inner function exists.

Practical use: factory functions, data privacy (module pattern), memoization, partial application, event handlers that need access to creation-time data.`
  },
  {
    q: 'What is the difference between var, let, and const?',
    a: `var: function-scoped, hoisted (initialized as undefined), can be redeclared.
let: block-scoped, in temporal dead zone before declaration, cannot be redeclared.
const: block-scoped, must be assigned at declaration, the binding can't be reassigned (but the value can be mutated if it's an object/array).

In modern code: use const by default, let when reassignment is needed, never var.`
  },
  {
    q: 'What is the temporal dead zone?',
    a: `The TDZ is the period between entering a scope and the declaration of a let/const variable being evaluated. Accessing the variable in the TDZ throws a ReferenceError.

var doesn't have a TDZ — it's hoisted and initialized as undefined. This is why let/const are safer: you can't accidentally use a variable before it's declared.`
  },
  {
    q: 'What is the classic closure-in-a-loop bug and how do you fix it?',
    a: `With var in a loop, all callback closures capture the same variable binding (not the value at that iteration). By the time the callbacks run, the loop has finished and the variable holds its final value.

Fixes:
1. Use let (creates a new binding per iteration)
2. IIFE: wrap each iteration in an immediately invoked function to capture a copy
3. .bind() or a closure factory function`
  },
  {
    q: 'What is hoisting?',
    a: `Hoisting is JavaScript's behavior of moving declarations to the top of their containing scope before code executes.

var declarations: hoisted and initialized as undefined
function declarations: hoisted completely (both declaration and body)
let/const declarations: hoisted but NOT initialized — in TDZ until the declaration is reached
function expressions / arrow functions: only the variable declaration is hoisted, not the value`
  },
]

function OverviewTab() {
  return (
    <div>
      <div className="callout callout-orange">
        <strong>Closures</strong> are one of the most fundamental (and most asked-about) JavaScript concepts.
        They underpin React hooks, event handlers, factory functions, memoization, and the module pattern.
      </div>
      <div className="section">
        <div className="section-title">🔑 Key Concepts</div>
        <div className="hook-grid">
          {[
            { name: 'Lexical Scope', desc: 'Scope determined by where code is written, not where it runs' },
            { name: 'Closure', desc: 'Function retains access to outer variables after outer fn returns' },
            { name: 'Hoisting', desc: 'var/function declarations moved to top of scope before execution' },
            { name: 'TDZ', desc: 'Temporal Dead Zone: let/const inaccessible before their declaration' },
            { name: 'IIFE', desc: 'Immediately Invoked Function Expression — creates isolated scope' },
            { name: 'Module Pattern', desc: 'Use closure to create private state with a public API' },
          ].map(h => (
            <div key={h.name} className="hook-card">
              <div className="hook-card-name">{h.name}</div>
              <div className="hook-card-desc">{h.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="callout callout-info">
        <strong>React connection:</strong> Every React hook closure captures variables from the render
        in which it was created. This is why stale closures are a common bug in useEffect — the closure
        captures an old state value.
      </div>
    </div>
  )
}

function ExamplesTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">1. Scope & Hoisting</div>
        <CodeBlock code={CODE_SCOPE} language="javascript" title="Lexical scope, var/let/const, hoisting" />
      </div>
      <div className="section">
        <div className="section-title">2. Closures in Action</div>
        <CodeBlock code={CODE_CLOSURE} language="javascript" title="Closures — counter, factory functions, multiplier" />
      </div>
      <div className="section">
        <div className="section-title">3. Classic Gotchas</div>
        <CodeBlock code={CODE_GOTCHA} language="javascript" title="Loop + var closure bug and fixes" />
      </div>
      <div className="section">
        <div className="section-title">4. Patterns Built on Closures</div>
        <CodeBlock code={CODE_PATTERNS} language="javascript" title="Module pattern, IIFE, memoization" />
      </div>
    </div>
  )
}

function RealWorldTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">🌐 Closures in the Wild</div>
        <ul>
          <li><strong>React hooks:</strong> Every hook is a closure. useCallback/useMemo prevent stale closures by re-creating functions when dependencies change.</li>
          <li><strong>Event handlers:</strong> DOM event handlers close over component data. In vanilla JS, event listeners in setup code capture state at setup time.</li>
          <li><strong>Debounce / Throttle:</strong> Use closures to store the timer ID across calls without a global variable.</li>
          <li><strong>Partial application / currying:</strong> <code>const addTax = (rate) =&gt; (price) =&gt; price * (1 + rate)</code> — each step creates a closure.</li>
          <li><strong>Module pattern:</strong> Before ES modules, the module pattern used IIFEs to create private scope. Still used in bundle output today.</li>
        </ul>
      </div>
      <div className="callout callout-warning">
        <strong>Memory note:</strong> Closures hold references to their outer scope. If a closure is
        long-lived (e.g., an event listener never removed), the closed-over variables can't be garbage
        collected even if they're large objects. Always clean up: <code>removeEventListener</code>,
        <code>clearInterval</code>, observable unsubscriptions.
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

export default function Closures() {
  return (
    <TopicPage
      title="Closures & Scope"
      emoji="🔒"
      description="Lexical scope, closures, hoisting, and the patterns built on top of them — foundational JavaScript knowledge."
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
