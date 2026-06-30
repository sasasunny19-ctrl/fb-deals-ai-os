import { parseDealsExcel } from '../utils/excelParser'

function Header({ records = [], onImport, onClear }) {
  async function handleImport(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (records.length > 0) {
      const ok = window.confirm(
        '当前系统已有数据，继续导入会覆盖现有数据。确定继续吗？'
      )

      if (!ok) {
        event.target.value = ''
        return
      }
    }

    const newRecords = await parseDealsExcel(file)
    onImport(newRecords)

    event.target.value = ''

    alert(`导入成功，共识别 ${newRecords.length} 条投放记录`)
  }

  function handleExport() {
    if (!records.length) {
      alert('当前没有可导出的数据')
      return
    }

    const exportData = {
      exportTime: new Date().toISOString(),
      total: records.length,
      records,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json;charset=utf-8',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'fb-deals-records.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  function handleClear() {
    if (!records.length) {
      alert('当前没有数据可清空')
      return
    }

    const ok = window.confirm(
      '确定要清空当前所有导入数据吗？此操作不会影响你的Excel源文件，但会清空系统当前缓存数据。'
    )

    if (!ok) return

    onClear()
    alert('数据已清空')
  }

  return (
    <header className="header">
      <div>
        <h1>FB Deals 智能运营系统</h1>
        <p>产品、群组、Tracking、人效、ROAS、月度决策一体化</p>
      </div>

      <div className="header-actions">
        <label className="import-button">
          导入Excel
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>

        <button onClick={handleExport}>导出数据</button>

        <button className="danger-button" onClick={handleClear}>
          清空数据
        </button>
      </div>
    </header>
  )
}

export default Header