import TopicPage from '../../components/TopicPage'
import CodeBlock from '../../components/CodeBlock'

const CODE_PRIMITIVES = `// TypeScript adds static types to JavaScript

// Primitive types
let name: string = 'Alice';
let age: number = 30;
let active: boolean = true;
let nothing: null = null;
let undef: undefined = undefined;

// Type inference — TypeScript usually figures it out
let count = 0;        // inferred as number
let label = 'hello';  // inferred as string

// Arrays
let scores: number[] = [95, 87, 92];
let tags: Array<string> = ['react', 'typescript'];

// Tuple — fixed-length array with specific types at each position
let coord: [number, number] = [10, 20];
let entry: [string, number] = ['Alice', 30];

// any — opt out of type checking (avoid if possible)
let data: any = fetchSomething();

// unknown — safer than any; must narrow before using
let result: unknown = getResult();
if (typeof result === 'string') {
  console.log(result.toUpperCase()); // safe
}

// never — function that never returns
function throwError(msg: string): never {
  throw new Error(msg);
}`

const CODE_INTERFACES = `// Interface — defines the shape of an object
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';   // literal union type
  avatar?: string;                         // optional property
  readonly createdAt: Date;                // cannot be reassigned
}

// Interface extension
interface AdminUser extends User {
  permissions: string[];
  department: string;
}

// Type alias — similar to interface, but more flexible
type Point = { x: number; y: number };
type ID = string | number;                 // union — interfaces can't do this
type Callback = (value: string) => void;   // function type

// Interface vs Type Alias:
// • Both can describe object shapes
// • interface supports declaration merging (can add fields after initial declaration)
// • type alias supports unions, intersections, mapped types, conditional types
// • Prefer interface for public API surface; type for complex type expressions

// Intersection type — combine multiple types
type AdminWithProfile = AdminUser & { bio: string };

// Function signatures
interface SearchFn {
  (query: string, options?: { limit: number }): Promise<User[]>;
}

// Index signature — for objects with dynamic keys
interface StringMap {
  [key: string]: string;
}
const headers: StringMap = { 'Content-Type': 'application/json' };`

const CODE_ENUMS = `// Enum — named set of constants
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

function move(dir: Direction) {
  console.log(\`Moving \${dir}\`);
}

move(Direction.Up);    // ✅
move('UP');            // ❌ type error

// Const enum — inlined at compile time, no runtime object
const enum Status {
  Pending = 'pending',
  Active = 'active',
  Inactive = 'inactive',
}

// Alternative: union of string literals (often preferred over enum)
type StatusType = 'pending' | 'active' | 'inactive';

// Object as const (another popular alternative)
const STATUS = {
  Pending: 'pending',
  Active: 'active',
  Inactive: 'inactive',
} as const;

type StatusFromObj = typeof STATUS[keyof typeof STATUS];
// → 'pending' | 'active' | 'inactive'`

const CODE_NARROWING = `// Type narrowing — TypeScript narrows types based on runtime checks

function processInput(input: string | number) {
  // typeof guard
  if (typeof input === 'string') {
    return input.toUpperCase();   // string here
  }
  return input.toFixed(2);        // number here
}

// instanceof guard
function formatDate(date: Date | string) {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return new Date(date).toISOString();
}

// in guard — checks for property existence
interface Cat { meow(): void }
interface Dog { bark(): void }

function makeNoise(animal: Cat | Dog) {
  if ('meow' in animal) {
    animal.meow();  // Cat here
  } else {
    animal.bark();  // Dog here
  }
}

// Type predicate — user-defined type guard
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj;
}

// Discriminated union — best pattern for complex types
type Shape =
  | { kind: 'circle';    radius: number }
  | { kind: 'square';    side: number }
  | { kind: 'rectangle'; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':    return Math.PI * shape.radius ** 2;
    case 'square':    return shape.side ** 2;
    case 'rectangle': return shape.width * shape.height;
  }
}

// Type assertion — when you know better than TypeScript
const input = document.getElementById('search') as HTMLInputElement;
input.value = 'hello';`

const QA = [
  {
    q: 'What is the difference between interface and type in TypeScript?',
    a: `Both can describe object shapes, but:
interface:
• Can be "declaration merged" — re-opening to add fields
• Slightly more readable error messages
• Can only describe objects and functions

type:
• Can create union types (A | B), intersection types (A & B)
• Can alias primitives, tuples, complex computed types
• Cannot be reopened after declaration

Rule of thumb: use interface for object shapes that may be extended; use type for everything else (unions, mapped types, utility compositions).`
  },
  {
    q: 'What is the difference between any and unknown?',
    a: `any disables type checking entirely — you can do anything with an any value without error.
unknown is the type-safe alternative — you must narrow the type before using the value.

Use unknown when receiving data from an external source (API response, JSON.parse, localStorage) and you want TypeScript to enforce that you check the type before use.
Avoid any except as a last resort when migrating JavaScript to TypeScript.`
  },
  {
    q: 'What is a discriminated union and when would you use it?',
    a: `A discriminated union is a union of types where each member has a shared "discriminant" property (like kind or type) with a unique literal value.

TypeScript uses the discriminant to narrow the type in switch/if statements, giving you full type safety on each branch.

Use it for: Redux-style action objects, API response variants, state machine states, any polymorphic value with distinct shapes.`
  },
  {
    q: 'What is the difference between type assertions (as) and type guards?',
    a: `Type assertion (as): you tell TypeScript "trust me, I know this is X". No runtime check — if you're wrong, you'll get a runtime error.
Type guard: an actual runtime check that TypeScript uses to narrow the type statically. Can be typeof, instanceof, in, or a user-defined type predicate (x is T).

Prefer type guards — they're safe. Use assertions only when you have certainty that TypeScript can't infer (e.g., DOM APIs).`
  },
]

function OverviewTab() {
  return (
    <div>
      <div className="callout callout-orange">
        <strong>Why TypeScript?</strong> Catch bugs at compile time, get excellent IDE autocomplete,
        make refactoring safe, and serve as living documentation. TypeScript is now the default
        choice for new React projects.
      </div>
      <div className="section">
        <div className="section-title">📋 Core Types at a Glance</div>
        <div className="hook-grid">
          {[
            { name: 'string', desc: 'Text values' },
            { name: 'number', desc: 'Integer & floating point' },
            { name: 'boolean', desc: 'true / false' },
            { name: 'null / undefined', desc: 'Absence of value' },
            { name: 'unknown', desc: 'Safe alternative to any' },
            { name: 'never', desc: 'Unreachable code / throws' },
            { name: 'A | B', desc: 'Union — either A or B' },
            { name: 'A & B', desc: 'Intersection — both A and B' },
          ].map(h => (
            <div key={h.name} className="hook-card">
              <div className="hook-card-name">{h.name}</div>
              <div className="hook-card-desc">{h.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="callout callout-info">
        <strong>TypeScript in React:</strong> Use <code>.tsx</code> files for JSX. Type your props
        with interfaces or type aliases. TypeScript will catch missing/wrong props at compile time.
      </div>
    </div>
  )
}

function ExamplesTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">1. Primitives, Arrays & Tuples</div>
        <CodeBlock code={CODE_PRIMITIVES} language="typescript" title="Primitive types + arrays + tuples" />
      </div>
      <div className="section">
        <div className="section-title">2. Interfaces & Type Aliases</div>
        <CodeBlock code={CODE_INTERFACES} language="typescript" title="Interface vs type alias — when to use each" />
      </div>
      <div className="section">
        <div className="section-title">3. Enums & String Literal Unions</div>
        <CodeBlock code={CODE_ENUMS} language="typescript" title="Enum vs string literal union vs as const" />
      </div>
      <div className="section">
        <div className="section-title">4. Type Narrowing & Discriminated Unions</div>
        <CodeBlock code={CODE_NARROWING} language="typescript" title="typeof, instanceof, in, type predicates, discriminated unions" />
      </div>
    </div>
  )
}

function RealWorldTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">🌐 TypeScript in a React Codebase</div>
        <ul>
          <li><strong>Typed props:</strong> Every component has an explicit <code>Props</code> interface — serves as documentation and prevents wrong usage.</li>
          <li><strong>API types:</strong> Define types for API responses at the boundary, validate with Zod or io-ts, then use typed data throughout.</li>
          <li><strong>Discriminated unions for state:</strong> <code>{'{ status: "loading" } | { status: "success"; data: T } | { status: "error"; error: string }'}</code></li>
          <li><strong>Strict mode:</strong> Enable <code>strict: true</code> in tsconfig — catches the most bugs. Specifically <code>noUncheckedIndexedAccess</code> for array safety.</li>
          <li><strong>Type-safe environment variables:</strong> Validate and type <code>process.env</code> with a Zod schema at startup.</li>
        </ul>
      </div>
      <div className="callout callout-success">
        <strong>Pro tip:</strong> TypeScript's goal is not to satisfy the type checker — it's to help you
        write correct code. If you find yourself casting with <code>as</code> frequently, that's a sign
        the architecture needs rethinking.
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

export default function TSBasics() {
  return (
    <TopicPage
      title="TypeScript Basics"
      emoji="📘"
      description="Types, interfaces, enums, type narrowing — the foundations of type-safe JavaScript development."
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
