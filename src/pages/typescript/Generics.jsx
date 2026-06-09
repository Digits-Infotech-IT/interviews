import TopicPage from '../../components/TopicPage'
import CodeBlock from '../../components/CodeBlock'

const CODE_GENERIC_FUNCTIONS = `// Generic function — parameterize the type like a variable
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);         // T inferred as number
const str = identity('hello');    // T inferred as string

// Generic function with multiple type params
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const result = pair('Alice', 30); // [string, number]

// Generic array utils
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const group = String(item[key]);
    return { ...acc, [group]: [...(acc[group] ?? []), item] };
  }, {} as Record<string, T[]>);
}

// Usage
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'editor' },
  { name: 'Carol', role: 'admin' },
];

const byRole = groupBy(users, 'role');
// → { admin: [...], editor: [...] }`

const CODE_CONSTRAINTS = `// Constraints — restrict what T can be
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Alice', age: 30, role: 'admin' };
const name = getProperty(user, 'name');   // string ✅
const age  = getProperty(user, 'age');    // number ✅
// getProperty(user, 'foo');             // ❌ type error: not a key

// Constrain to objects with specific shape
interface HasId { id: number | string; }

function findById<T extends HasId>(items: T[], id: T['id']): T | undefined {
  return items.find(item => item.id === id);
}

// Constrain to constructor functions
function createInstance<T>(ctor: new () => T): T {
  return new ctor();
}

// Generic class
class Repository<T extends HasId> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: T['id']): T | undefined {
    return this.items.find(i => i.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }
}

const repo = new Repository<User>();
repo.add({ id: 1, name: 'Alice' });
const alice = repo.findById(1); // User | undefined`

const CODE_UTILITY_TYPES = `// Built-in Utility Types — super common in interviews!

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Partial<T> — all properties optional (useful for update payloads)
type UserUpdate = Partial<User>;
// → { id?: number; name?: string; email?: string; ... }

// Required<T> — all properties required (opposite of Partial)
type RequiredUser = Required<User>;

// Readonly<T> — all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick<T, K> — keep only specified keys
type UserSummary = Pick<User, 'id' | 'name' | 'email'>;
// → { id: number; name: string; email: string }

// Omit<T, K> — drop specified keys (inverse of Pick)
type PublicUser = Omit<User, 'password' | 'createdAt'>;
// → { id; name; email; role }

// Record<K, V> — object type with keys K and values V
type RolePermissions = Record<User['role'], string[]>;
// → { admin: string[]; user: string[] }

// ReturnType<T> — extract return type of a function
function getUser() { return { id: 1, name: 'Alice' }; }
type GetUserReturn = ReturnType<typeof getUser>;
// → { id: number; name: string }

// Parameters<T> — extract parameter types as a tuple
type GetUserParams = Parameters<typeof fetchUser>;

// Awaited<T> — unwrap Promise
type UnwrappedUser = Awaited<Promise<User>>;
// → User

// NonNullable<T> — remove null and undefined
type SafeString = NonNullable<string | null | undefined>;
// → string`

const CODE_CONDITIONAL = `// Conditional types — the type system's ternary operator
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>;  // 'yes'
type B = IsString<number>;  // 'no'

// Extract and Exclude (built-ins using conditional types)
type ExtractedStrings = Extract<string | number | boolean, string>;
// → string

type WithoutNull = Exclude<string | null | undefined, null | undefined>;
// → string  (same as NonNullable)

// Infer — extract a type from another type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type ElementType<T> = T extends (infer E)[] ? E : never;

type Fn = () => { id: number; name: string };
type R = ReturnType<Fn>;        // { id: number; name: string }

type Arr = string[];
type El = ElementType<Arr>;     // string

// Mapped types — transform all properties
type Optional<T> = { [K in keyof T]?: T[K] };        // same as Partial
type Nullable<T> = { [K in keyof T]: T[K] | null };

// Template literal types
type EventName = 'click' | 'focus' | 'blur';
type Handler = \`on\${Capitalize<EventName>}\`;
// → 'onClick' | 'onFocus' | 'onBlur'`

const QA = [
  {
    q: 'What is the difference between Partial and Required?',
    a: `Partial<T> makes all properties of T optional (adds ?).
Required<T> makes all properties of T required (removes ?).

Common use: Partial for update/patch API payloads where only changed fields are sent.`
  },
  {
    q: 'What is the difference between Pick and Omit?',
    a: `Pick<T, K>: create a new type with only the specified keys from T.
Omit<T, K>: create a new type without the specified keys from T.

Use Pick when you want a few fields from a large type.
Use Omit when you want most fields but need to exclude a few (like removing 'password' from a User for public API responses).`
  },
  {
    q: 'What are generic constraints and why do you need them?',
    a: `Generic constraints (extends) restrict what types can be passed as a type argument.
Without constraints, TypeScript assumes T can be anything, so you can't access properties or call methods on it.
Example: <T extends { id: number }> lets you access item.id safely.
Common constraint patterns:
• T extends object — only object types
• T extends keyof SomeInterface — only valid keys
• T extends SomeClass — only instances of that class`
  },
  {
    q: 'What is the keyof operator?',
    a: `keyof T produces a union of all keys of type T as string or number literal types.
interface User { id: number; name: string; email: string }
type UserKey = keyof User;  // 'id' | 'name' | 'email'

Combined with generics it enables type-safe property access functions like getProperty<T, K extends keyof T>(obj: T, key: K): T[K].`
  },
]

function OverviewTab() {
  return (
    <div>
      <div className="callout callout-orange">
        <strong>Generics</strong> let you write reusable code that works with any type while still being
        fully type-safe. Think of <code>{'<T>'}</code> as a type variable — a placeholder filled in when
        the function/class/interface is used.
      </div>
      <div className="section">
        <div className="section-title">🛠️ Utility Types Cheat Sheet</div>
        <div className="hook-grid">
          {[
            { name: 'Partial<T>', desc: 'All props optional' },
            { name: 'Required<T>', desc: 'All props required' },
            { name: 'Readonly<T>', desc: 'All props readonly' },
            { name: 'Pick<T, K>', desc: 'Keep only K keys' },
            { name: 'Omit<T, K>', desc: 'Drop K keys' },
            { name: 'Record<K,V>', desc: 'Object with key K, val V' },
            { name: 'ReturnType<T>', desc: 'Function return type' },
            { name: 'Awaited<T>', desc: 'Unwrap Promise<T>' },
            { name: 'NonNullable<T>', desc: 'Remove null/undefined' },
            { name: 'Extract<T,U>', desc: 'Intersect union with U' },
            { name: 'Exclude<T,U>', desc: 'Subtract U from union' },
            { name: 'Parameters<T>', desc: 'Function param tuple' },
          ].map(h => (
            <div key={h.name} className="hook-card">
              <div className="hook-card-name">{h.name}</div>
              <div className="hook-card-desc">{h.desc}</div>
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
        <div className="section-title">1. Generic Functions</div>
        <CodeBlock code={CODE_GENERIC_FUNCTIONS} language="typescript" title="Generic functions — identity, pair, groupBy" />
      </div>
      <div className="section">
        <div className="section-title">2. Constraints & Generic Classes</div>
        <CodeBlock code={CODE_CONSTRAINTS} language="typescript" title="extends constraints + generic Repository class" />
      </div>
      <div className="section">
        <div className="section-title">3. Utility Types</div>
        <CodeBlock code={CODE_UTILITY_TYPES} language="typescript" title="Partial, Required, Pick, Omit, Record, ReturnType…" />
      </div>
      <div className="section">
        <div className="section-title">4. Conditional & Mapped Types</div>
        <CodeBlock code={CODE_CONDITIONAL} language="typescript" title="Conditional types, infer, mapped types, template literals" />
      </div>
    </div>
  )
}

function RealWorldTab() {
  return (
    <div>
      <div className="section">
        <div className="section-title">🌐 Generics in Production</div>
        <ul>
          <li><strong>API response wrapper:</strong> <code>{'type ApiResponse<T> = { data: T; status: number; message: string }'}</code></li>
          <li><strong>Form hook:</strong> <code>{'useForm<T extends object>(schema: ZodSchema<T>): FormReturn<T>'}</code></li>
          <li><strong>Generic list component:</strong> <code>{'<List<T> items={T[]} renderItem={(item: T) => ReactNode} />'}</code> — fully typed without any</li>
          <li><strong>Repository / service layer:</strong> Generic CRUD base class that typed repositories extend</li>
          <li><strong>Utility types:</strong> Used everywhere — <code>Partial</code> for update payloads, <code>Omit</code> for public DTOs, <code>ReturnType</code> for auto-inferring hook return types</li>
        </ul>
      </div>
      <div className="callout callout-info">
        <strong>Interview tip:</strong> Be able to explain why you'd use generics over <code>any</code>.
        Generics preserve type relationships — the caller knows the return type matches the input type.
        <code>any</code> throws away that information entirely.
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

export default function TSGenerics() {
  return (
    <TopicPage
      title="Generics & Utility Types"
      emoji="🔧"
      description="Write reusable, type-safe abstractions with generics, constraints, and TypeScript's built-in utility types."
      difficulty="Advanced"
      tabs={[
        { id: 'overview', label: 'Overview', icon: '📖', content: <OverviewTab /> },
        { id: 'examples', label: 'Syntax & Examples', icon: '💻', content: <ExamplesTab /> },
        { id: 'realworld', label: 'Real-World', icon: '🚀', content: <RealWorldTab /> },
        { id: 'qa', label: 'Interview Q&A', icon: '❓', content: <QATab /> },
      ]}
    />
  )
}
