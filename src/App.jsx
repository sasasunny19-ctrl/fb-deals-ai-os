import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {
  const [records, setRecords] = useState([])

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Header onImport={setRecords} />
        <Dashboard records={records} />
      </main>
    </div>
  )
}

export default App