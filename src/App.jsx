import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Header />
        <Dashboard />
      </main>
    </div>
  )
}

export default App