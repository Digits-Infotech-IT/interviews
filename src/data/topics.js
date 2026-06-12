export const TOPICS = {
  react: {
    label: 'React',
    emoji: '⚛️',
    description: 'Master components, hooks, state, context, and performance patterns',
    color: '#61DAFB',
    bgColor: 'rgba(97,218,251,0.1)',
    topics: [
      { path: '/react/hooks', label: 'React Hooks', badge: 'Essential', desc: 'useState, useEffect, useCallback, useMemo, useRef, custom hooks' },
      { path: '/react/components', label: 'Components', badge: 'Core', desc: 'Functional, memoization, patterns, composition' },
      { path: '/react/state', label: 'State Management', badge: 'Important', desc: 'useState, useReducer, Context API, lifting state' },
      { path: '/react/fragments', label: 'Fragments', badge: 'Core', desc: 'Group siblings without extra DOM nodes, key on Fragment, table/dl use cases' },
      { path: '/react/usestate-deep', label: 'useState Deep Dive', badge: 'Core', desc: 'Why setCount is async, state snapshots, functional updates vs direct updates' },
      { path: '/react/rendering-snapshot', label: 'Rendering & Snapshots', badge: 'Core', desc: 'How React freezes state per render, snapshot concept, direct vs functional updates' },
      { path: '/react/passing-data', label: 'Passing Data', badge: 'Important', desc: 'Props, callbacks, lifting state, Context, custom hooks, Zustand, URL params, localStorage, refs, event bus' },
    ]
  },
  typescript: {
    label: 'TypeScript',
    emoji: '📘',
    description: 'Type safety, interfaces, generics, and advanced TypeScript patterns',
    color: '#3178C6',
    bgColor: 'rgba(49,120,198,0.1)',
    topics: [
      { path: '/typescript/basics', label: 'TypeScript Basics', badge: 'Essential', desc: 'Types, interfaces, enums, type narrowing, assertions' },
      { path: '/typescript/generics', label: 'Generics & Utility Types', badge: 'Advanced', desc: 'Generic functions, constraints, Partial, Pick, Omit, Record' },
    ]
  },
  javascript: {
    label: 'JavaScript',
    emoji: '⚡',
    description: 'Core JS concepts every developer must deeply understand',
    color: '#F7DF1E',
    bgColor: 'rgba(247,223,30,0.1)',
    topics: [
      { path: '/javascript/closures', label: 'Closures & Scope', badge: 'Essential', desc: 'Lexical scope, closures, hoisting, IIFE, module pattern' },
      { path: '/javascript/async', label: 'Async JavaScript', badge: 'Essential', desc: 'Event loop, Promises, async/await, error handling' },
    ]
  }
}

export const BADGE_VARIANTS = {
  Essential: 'badge-essential',
  Advanced: 'badge-advanced',
  Core: 'badge-core',
  Important: 'badge-important',
}
