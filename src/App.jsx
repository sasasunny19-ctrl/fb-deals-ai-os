import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard/Dashboard'
import ProductCenter from './pages/Products/ProductCenter'
import GroupCenter from './pages/Groups/GroupCenter'
import CampaignCenter from './pages/Campaigns/CampaignCenter'
import TrackingCenter from './pages/Tracking/TrackingCenter'
import AnalyticsCenter from './pages/Analytics/AnalyticsCenter'

function App() {
  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem('fbDealsRecords')
    return savedRecords ? JSON.parse(savedRecords) : []
  })

  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    localStorage.setItem('fbDealsRecords', JSON.stringify(records))
  }, [records])

  function renderPage() {
    if (currentPage === 'products') {
      return <ProductCenter records={records} />
    }

    if (currentPage === 'groups') {
      return <GroupCenter records={records} />
    }

    if (currentPage === 'campaigns') {
      return <CampaignCenter records={records} />
    }

    return <Dashboard records={records} />
  }
  if (currentPage === 'tracking') {
  return <TrackingCenter records={records} />
}
if (currentPage === 'analytics') {
  return <AnalyticsCenter records={records} />
}
  

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      <main className="main">
        <Header onImport={setRecords} />
        {renderPage()}
      </main>
    </div>
  )
}

export default App