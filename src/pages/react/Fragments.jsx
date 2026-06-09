import TopicPage from '../../components/TopicPage'
import CodeBlock from '../../components/CodeBlock'

// ─── MVP CODE ─────────────────────────────────────────────────────────────────
// The absolute minimum to understand Fragments — memorise this for interviews
const CODE_MVP = `// ❌ BEFORE Fragments — forced to wrap in a useless <div>
function LabelValue() {
  return (
    <div>          {/* extra div pollutes the DOM */}
      <dt>Name</dt>
      <dd>Alice</dd>
    </div>
  );
}

// ✅ AFTER — short syntax <> ... </> — no extra DOM node
function LabelValue() {
  return (
    <>
      <dt>Name</dt>
      <dd>Name</dd>
    </>
  );
}

// ✅ Named syntax — required when you need the key prop (e.g. inside .map())
import { Fragment } from 'react';

function LabelValue({ label, value }) {
  return (
    <Fragment>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </Fragment>
  );
}`

// ─── SYNTAX EXAMPLES ──────────────────────────────────────────────────────────
const CODE_SYNTAX = `// Two syntaxes — know both for the interview

// 1. Short syntax (JSX sugar) — can NOT accept props
<>
  <h1>Title</h1>
  <p>Paragraph</p>
</>

// 2. Named syntax — CAN accept the key prop
import { Fragment } from 'react';

<Fragment key={item.id}>
  <dt>{item.label}</dt>
  <dd>{item.value}</dd>
</Fragment>

// React.Fragment is the same as Fragment (named import is cleaner)
<React.Fragment>...</React.Fragment>`

// ─── REAL-WORLD: Table Rows ────────────────────────────────────────────────────
const CODE_TABLE = `// Real-world: rendering table rows from a component
// A <tr> must be a direct child of <tbody> — a wrapper <div> would break HTML

function UserRow({ user }) {
  return (
    <>
      <tr className="user-main-row">
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
      </tr>
      <tr className="user-detail-row">
        <td colSpan={3}>
          <small>Last login: {user.lastLogin}</small>
        </td>
      </tr>
    </>
  );
}

function UsersTable({ users }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th><th>Email</th><th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          // key goes on Fragment because map() requires it
          <Fragment key={user.id}>
            <UserRow user={user} />
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}`

// ─── REAL-WORLD: Definition List ──────────────────────────────────────────────
const CODE_DEFINITION_LIST = `// Real-world: a <dl> requires <dt>/<dd> pairs as direct children
// A wrapping <div> would make the HTML invalid

import { Fragment } from 'react';

const productDetails = [
  { label: 'Brand',    value: 'Nike' },
  { label: 'Color',    value: 'White / Black' },
  { label: 'Material', value: 'Mesh' },
  { label: 'In Stock', value: 'Yes' },
];

function ProductSpecs({ specs }) {
  return (
    <dl>
      {specs.map(({ label, value }) => (
        <Fragment key={label}>   {/* key only works on <Fragment>, not <> */}
          <dt>{label}</dt>
          <dd>{value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

// Output DOM — clean, no wrappers:
// <dl>
//   <dt>Brand</dt><dd>Nike</dd>
//   <dt>Color</dt><dd>White / Black</dd>
//   ...
// </dl>`

// ─── REAL-WORLD: Conditional multi-element render ─────────────────────────────
const CODE_CONDITIONAL = `// Real-world: return multiple sibling elements conditionally
// Without Fragment you'd need a wrapper that breaks layout/styling

function AuthStatus({ isLoggedIn, user }) {
  if (isLoggedIn) {
    return (
      <>
        <span className="avatar">{user.initials}</span>
        <span className="username">{user.name}</span>
        <button onClick={logout}>Logout</button>
      </>
    );
  }

  return (
    <>
      <a href="/login">Login</a>
      <a href="/signup">Sign Up</a>
    </>
  );
}

// These siblings are injected directly into the Navbar's flex container —
// any wrapper <div> would break the flex layout.`

const QA = [
  {
    q: 'What is a React Fragment and why does it exist?',
    a: `A Fragment lets you group multiple JSX elements without adding an extra DOM node.
Before Fragments, returning sibling elements required wrapping them in a <div>, which:
• Added unnecessary nodes to the DOM
• Could break HTML rules (e.g. <tr> inside a <div> inside <tbody>)
• Could break CSS layouts (flexbox/grid children count)

Fragments solve this — group siblings without any wrapper in the output DOM.`
  },
  {
    q: 'What are the two ways to write a Fragment? When do you use each?',
    a: `Short syntax:  <>...</>  — most common, clean, but cannot accept any props.

Named syntax:  <Fragment key={id}>...</Fragment>  — use this when you need to pass the key prop, which is required when rendering fragments inside a .map().

Rule: use <> by default; switch to <Fragment> only when you need key.`
  },
  {
    q: 'Give a real-world case where a Fragment is NECESSARY (not just optional).',
    a: `Table rows. A <UserRow /> component that returns two <tr> elements must use a Fragment:

  <>
    <tr>...</tr>
    <tr>...</tr>
  </>

A <div> wrapper would produce invalid HTML because a <div> is not a valid child of <tbody>. The browser would silently move the <div> outside the table, completely breaking the layout.

Same applies to <dt>/<dd> pairs inside <dl>, and any context with strict HTML parent-child rules.`
  },
  {
    q: 'Can a Fragment have a key? Can it have other props?',
    a: `key — YES, but only with the named <Fragment key={...}> syntax. The short <> syntax cannot accept any props.

Other props — NO. Fragment only accepts key. It has no className, style, or event handlers. It is not a real DOM element — it leaves no trace in the output HTML.`
  },
  {
    q: 'How does Fragment affect performance?',
    a: `Fragments slightly IMPROVE performance because React renders one fewer DOM node. Fewer DOM nodes means:
• Less memory usage in the browser
• Faster layout/reflow calculations
• Cleaner DevTools tree

The effect is tiny per-fragment, but it adds up in deeply nested trees or large lists.`
  },
]

function OverviewTab() {
  return (
    <div>
      <div className="callout callout-orange">
        <strong>One-line answer for interviewers:</strong> A Fragment groups multiple JSX elements
        into one return value without adding any extra node to the DOM — it's invisible in the HTML output.
      </div>
      <div className="section">
        <div className="section-title">🧩 Why Fragments Exist</div>
        <div className="two-col">
          <div className="comparison-box">
            <h4>Problem — wrapper div pollution</h4>
            <ul>
              <li>JSX requires a single root element</li>
              <li>Forced extra <code>&lt;div&gt;</code> adds noise to the DOM</li>
              <li>Breaks HTML structure rules (table, dl, etc.)</li>
              <li>Breaks CSS flexbox / grid child count</li>
              <li>Extra node = slightly more memory + reflow cost</li>
            </ul>
          </div>
          <div className="comparison-box">
            <h4>Solution — Fragment</h4>
            <ul>
              <li>Group siblings with <code>&lt;&gt;...&lt;/&gt;</code></li>
              <li>Zero DOM output — invisible in HTML</li>
              <li>Preserves valid HTML structure</li>
              <li>Flex/grid layout sees correct children</li>
              <li>Use <code>&lt;Fragment key=&#123;...&#125;&gt;</code> in .map()</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-title">⚡ Two Syntaxes — Know Both</div>
        <CodeBlock code={CODE_SYNTAX} language="jsx" title="Short syntax vs Named syntax" />
      </div>
      <div className="callout callout-info">
        <strong>Memory trick:</strong> Short <code>&lt;&gt;</code> = no props allowed.
        Named <code>&lt;Fragment&gt;</code> = only accepts <code>key</code>. Nothing else ever.
      </div>
    </div>
  )
}

function ExamplesTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">⭐ MVP — Minimum Viable Pattern (memorise this)</div>
        <div className="callout callout-orange">
          This is the core pattern. If you can explain and write this in an interview, you pass the Fragment question.
        </div>
        <CodeBlock code={CODE_MVP} language="jsx" title="Fragment MVP — before vs after, short vs named syntax" />
      </div>
      <div className="section">
        <div className="section-title">1. Table Rows — Fragment is REQUIRED</div>
        <CodeBlock code={CODE_TABLE} language="jsx" title="Fragment with key in table rows — <div> would break HTML" />
      </div>
      <div className="section">
        <div className="section-title">2. Definition List Pairs</div>
        <CodeBlock code={CODE_DEFINITION_LIST} language="jsx" title="Fragment in .map() — dt/dd pairs without wrapper" />
      </div>
      <div className="section">
        <div className="section-title">3. Conditional Multi-Element Render</div>
        <CodeBlock code={CODE_CONDITIONAL} language="jsx" title="Fragment for conditional sibling elements" />
      </div>
    </div>
  )
}

function RealWorldTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">🌐 Where You'll See Fragments in Production</div>
        <ul>
          <li><strong>Data tables:</strong> Row components that expand into multiple <code>&lt;tr&gt;</code> elements (master + detail row)</li>
          <li><strong>Form field groups:</strong> A <code>&lt;FieldGroup&gt;</code> component returns a <code>&lt;label&gt;</code> + <code>&lt;input&gt;</code> + <code>&lt;span&gt;</code> (error) as siblings</li>
          <li><strong>Breadcrumbs:</strong> Each crumb returns a <code>&lt;li&gt;</code> + <code>&lt;span&gt;</code> separator without a wrapper</li>
          <li><strong>Navbar items:</strong> Auth-aware components return 2–3 sibling elements injected into a flex container</li>
          <li><strong>Content renderers:</strong> A rich-text block renderer returns a heading + paragraphs without wrapper <code>&lt;div&gt;</code></li>
        </ul>
      </div>
      <div className="section">
        <div className="section-title">🏗 Real App Pattern: Expandable Table Rows</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
          In a data-heavy dashboard (analytics, CRM, admin panels), each row may expand to show details.
          Without Fragment, you can't return two sibling <code>&lt;tr&gt;</code> elements from a component —
          the DOM would be broken. This pattern is extremely common in enterprise React apps.
        </p>
        <div className="callout callout-info">
          <strong>Interview answer template:</strong> "In our admin dashboard, each <code>OrderRow</code> component
          rendered both the summary row and an expandable detail row. We used <code>&lt;Fragment key=&#123;order.id&#125;&gt;</code>
          inside .map() because short syntax doesn't accept key, and wrapping with a div would have broken
          the table structure entirely."
        </div>
      </div>
      <div className="section">
        <div className="section-title">✅ Decision Guide</div>
        <div className="two-col">
          <div className="comparison-box">
            <h4>Use Fragment when…</h4>
            <ul>
              <li>Returning 2+ sibling elements</li>
              <li>Parent has strict HTML child rules (table, dl, ol)</li>
              <li>Parent is a flex/grid container — exact child count matters</li>
              <li>Mapping over items that produce multiple siblings</li>
            </ul>
          </div>
          <div className="comparison-box">
            <h4>Use a div when…</h4>
            <ul>
              <li>You actually need the wrapper for styling</li>
              <li>You need to attach event listeners to the group</li>
              <li>You need className or style on the container</li>
              <li>The wrapper is semantically meaningful</li>
            </ul>
          </div>
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
          <div className="qa-question"><span className="qa-q-icon">Q</span>{item.q}</div>
          <div className="qa-answer" style={{ whiteSpace: 'pre-line' }}>{item.a}</div>
        </div>
      ))}
    </div>
  )
}

export default function ReactFragments() {
  return (
    <TopicPage
      title="React Fragments"
      emoji="🔲"
      description="Group multiple JSX elements without adding extra DOM nodes — essential for valid HTML structure and clean layouts."
      difficulty="Core"
      tabs={[
        { id: 'overview',   label: 'Overview',         icon: '📖', content: <OverviewTab /> },
        { id: 'examples',   label: 'Syntax & Examples', icon: '💻', content: <ExamplesTab /> },
        { id: 'realworld',  label: 'Real-World',        icon: '🚀', content: <RealWorldTab /> },
        { id: 'qa',         label: 'Interview Q&A',     icon: '❓', content: <QATab /> },
      ]}
    />
  )
}
