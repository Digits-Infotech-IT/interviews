import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import ReactHooks from './pages/react/Hooks'
import ReactComponents from './pages/react/Components'
import StateManagement from './pages/react/StateManagement'
import TSBasics from './pages/typescript/Basics'
import TSGenerics from './pages/typescript/Generics'
import Closures from './pages/javascript/Closures'
import AsyncJS from './pages/javascript/AsyncJS'
import ReactFragments from './pages/react/Fragments'
import { TOPICS } from './data/topics'
import './App.css'

function Layout() {
  const location = useLocation()
  const category = location.pathname.split('/')[1]
  const navConfig = TOPICS[category]

  return (
    <div className="app-layout">
      <Navbar />
      <div className="page-container">
        {navConfig && <Sidebar title={navConfig.label} emoji={navConfig.emoji} topics={navConfig.topics} />}
        <main className={`content-area ${navConfig ? 'with-sidebar' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="react/hooks" element={<ReactHooks />} />
          <Route path="react/components" element={<ReactComponents />} />
          <Route path="react/state" element={<StateManagement />} />
          <Route path="react/fragments" element={<ReactFragments />} />
          <Route path="typescript/basics" element={<TSBasics />} />
          <Route path="typescript/generics" element={<TSGenerics />} />
          <Route path="javascript/closures" element={<Closures />} />
          <Route path="javascript/async" element={<AsyncJS />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
