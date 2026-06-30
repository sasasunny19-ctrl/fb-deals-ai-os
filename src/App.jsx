import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard/Dashboard'
import ProductCenter from './pages/Products/ProductCenter'
import GroupCenter from './pages/Groups/GroupCenter'
import CampaignCenter from './pages/Campaigns/CampaignCenter'
import TrackingCenter from './pages/Tracking/TrackingCenter'
import AnalyticsCenter from './pages/Analytics/AnalyticsCenter'
import AICenter from './pages/AI/AICenter'
import ReportCenter from './pages/Reports/ReportCenter'
import SettingsCenter from './pages/Settings/SettingsCenter'
import MonthFilter from './components/MonthFilter'

function App() {
  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem('fbDealsRecords')
    return savedRecords ? JSON.parse(savedRecords) : []
  })

  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedMonths, setSelectedMonths] = useState([])

  useEffect(() => {
    localStorage.setItem('fbDealsRecords', JSON.stringify(records))
  }, [records])
  useEffect(() => {
  const months = Array.from(
    new Set(records.map((row) => row.month).filter(Boolean))
  ).sort()

  if (months.length && selectedMonths.length === 0) {
    setSelectedMonths(months)
  }
}, [records])
const filteredRecords = useMemo(() => {
  if (!selectedMonths.length) return records

  return records.filter((row) => selectedMonths.includes(row.month))
}, [records, selectedMonths])

  function renderPage() {
    if (currentPage === 'products') return <ProductCenter records={filteredRecords} />
    if (currentPage === 'groups') return <GroupCenter records={filteredRecords} />
    if (currentPage === 'campaigns') return <CampaignCenter records={filteredRecords} />
    if (currentPage === 'tracking') return <TrackingCenter records={filteredRecords} />
    if (currentPage === 'analytics') return <AnalyticsCenter records={filteredRecords} />
    if (currentPage === 'ai') return <AICenter records={filteredRecords} />
    if (currentPage === 'reports') return <ReportCenter records={filteredRecords} />
    if (currentPage === 'settings') return <SettingsCenter />

    return <Dashboard records={filteredRecords} />
  }

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      <main className="main">
       <Header
  records={records}
  onImport={(newRecords) => {
    setRecords(newRecords)

    const months = Array.from(
      new Set(newRecords.map((row) => row.month).filter(Boolean))
    ).sort()

    setSelectedMonths(months)
  }}
  onClear={() => {
    setRecords([])
    setSelectedMonths([])
    localStorage.removeItem('fbDealsRecords')
  }}
/>

<MonthFilter
  records={records}
  selectedMonths={selectedMonths}
  onChange={setSelectedMonths}
/>

{renderPage()}
      </main>
    </div>
  )
}

export default App